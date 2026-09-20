import { Router } from 'express';
import { z } from 'zod';

import type { AuthedRequest } from '../middleware/auth';
import { requireAuth } from '../middleware/auth';
import { HttpError } from '../middleware/errorHandler';
import { prisma } from '../services/prisma';
import { sendPushToDevice } from '../services/push';

export const ordersRouter = Router();

ordersRouter.use(requireAuth);

// Platform takes a 20% commission on the delivery fee, credited to the
// driver once a delivery is confirmed — adjust to droppd's actual rate card.
const DRIVER_PAYOUT_RATE = 0.8;

function randomConfirmationCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function notifyUser(userId: string, title: string, body: string, data?: Record<string, string>) {
  const tokens = await prisma.deviceToken.findMany({ where: { userId } });
  await Promise.all(tokens.map((t) => sendPushToDevice(t.token, { title, body, data })));
}

function serializeOrder(order: {
  id: string;
  customerId: string;
  driverId: string | null;
  pickupAddress: unknown;
  dropoffAddress: unknown;
  status: string;
  statusHistory: unknown;
  feeKobo: number;
  confirmationCode: string;
  etaMinutes: number;
  createdAt: Date;
}) {
  return {
    id: order.id,
    customerId: order.customerId,
    driverId: order.driverId,
    pickup: order.pickupAddress,
    dropoff: order.dropoffAddress,
    status: order.status.toLowerCase(),
    statusHistory: order.statusHistory,
    fee: order.feeKobo,
    currency: 'NGN',
    confirmationCode: order.confirmationCode,
    etaMinutes: order.etaMinutes,
    createdAt: order.createdAt.toISOString(),
  };
}

const createOrderSchema = z.object({
  pickupAddressId: z.string(),
  dropoffAddressId: z.string(),
  feeKobo: z.number().int().positive().optional(), // real implementation should quote this server-side from a pricing service
});

ordersRouter.post('/', async (req: AuthedRequest, res, next) => {
  try {
    if (req.userRole !== 'CUSTOMER') throw new HttpError(403, 'Only customers can create orders');
    const { pickupAddressId, dropoffAddressId, feeKobo } = createOrderSchema.parse(req.body);
    const fee = feeKobo ?? 100000; // ₦1,000 default placeholder quote

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          customerId: req.userId!,
          pickupAddressId,
          dropoffAddressId,
          feeKobo: fee,
          confirmationCode: randomConfirmationCode(),
          etaMinutes: 25,
          status: 'PLACED',
          statusHistory: [{ status: 'placed', label: 'Order Placed', timestamp: new Date().toISOString() }],
        },
        include: { pickupAddress: true, dropoffAddress: true },
      });
      await tx.user.update({ where: { id: req.userId }, data: { balanceKobo: { decrement: fee } } });
      await tx.walletTransaction.create({
        data: {
          userId: req.userId!,
          kind: 'DEBIT',
          label: `Delivery fee — Pkg #${created.id.slice(-6).toUpperCase()}`,
          amountKobo: fee,
          relatedOrderId: created.id,
        },
      });
      return created;
    });

    res.status(201).json(serializeOrder(order));
  } catch (err) {
    next(err);
  }
});

ordersRouter.get('/active', async (req: AuthedRequest, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ customerId: req.userId }, { driverId: req.userId }],
        status: { notIn: ['DELIVERED', 'CANCELLED'] },
      },
      include: { pickupAddress: true, dropoffAddress: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(order ? serializeOrder(order) : null);
  } catch (err) {
    next(err);
  }
});

ordersRouter.get('/available', async (req: AuthedRequest, res, next) => {
  try {
    if (req.userRole !== 'DRIVER') throw new HttpError(403, 'Only drivers can view available jobs');
    const orders = await prisma.order.findMany({
      where: { status: 'PLACED', driverId: null },
      include: { pickupAddress: true, dropoffAddress: true },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });
    res.json(orders.map(serializeOrder));
  } catch (err) {
    next(err);
  }
});

ordersRouter.get('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: req.params.id },
      include: { pickupAddress: true, dropoffAddress: true },
    });
    if (order.customerId !== req.userId && order.driverId !== req.userId) {
      throw new HttpError(403, 'Not authorized to view this order');
    }
    res.json(serializeOrder(order));
  } catch (err) {
    next(err);
  }
});

ordersRouter.post('/:id/accept', async (req: AuthedRequest, res, next) => {
  try {
    if (req.userRole !== 'DRIVER') throw new HttpError(403, 'Only drivers can accept jobs');
    const existing = await prisma.order.findUniqueOrThrow({ where: { id: req.params.id } });
    if (existing.driverId) throw new HttpError(409, 'This job has already been accepted');

    const history = Array.isArray(existing.statusHistory) ? existing.statusHistory : [];
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        driverId: req.userId,
        status: 'PICKED_UP',
        statusHistory: [...history, { status: 'picked_up', label: 'Picked Up', timestamp: new Date().toISOString() }],
      },
      include: { pickupAddress: true, dropoffAddress: true },
    });

    await notifyUser(order.customerId, 'Driver assigned', 'A courier has picked up your package and is on the way.', {
      orderId: order.id,
    });

    res.json(serializeOrder(order));
  } catch (err) {
    next(err);
  }
});

const completeSchema = z.object({ code: z.string().length(4) });

ordersRouter.post('/:id/complete', async (req: AuthedRequest, res, next) => {
  try {
    if (req.userRole !== 'DRIVER') throw new HttpError(403, 'Only the assigned driver can confirm delivery');
    const { code } = completeSchema.parse(req.body);
    const existing = await prisma.order.findUniqueOrThrow({ where: { id: req.params.id } });

    if (existing.driverId !== req.userId) throw new HttpError(403, 'You are not the assigned driver for this order');
    if (existing.confirmationCode !== code) {
      throw new HttpError(400, "That code doesn't match. Ask the customer to confirm their 4-digit code.");
    }

    const history = Array.isArray(existing.statusHistory) ? existing.statusHistory : [];
    const payout = Math.round(existing.feeKobo * DRIVER_PAYOUT_RATE);

    const order = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: req.params.id },
        data: {
          status: 'DELIVERED',
          statusHistory: [...history, { status: 'delivered', label: 'Delivered', timestamp: new Date().toISOString() }],
        },
        include: { pickupAddress: true, dropoffAddress: true },
      });
      await tx.user.update({ where: { id: req.userId }, data: { balanceKobo: { increment: payout }, totalDeliveries: { increment: 1 } } });
      await tx.walletTransaction.create({
        data: {
          userId: req.userId!,
          kind: 'CREDIT',
          label: `Delivery earnings — Pkg #${updated.id.slice(-6).toUpperCase()}`,
          amountKobo: payout,
          relatedOrderId: updated.id,
        },
      });
      return updated;
    });

    await notifyUser(order.customerId, 'Package delivered', 'Your package has been delivered and confirmed.', { orderId: order.id });

    res.json(serializeOrder(order));
  } catch (err) {
    next(err);
  }
});
