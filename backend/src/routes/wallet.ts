import { Router } from 'express';
import { z } from 'zod';

import type { AuthedRequest } from '../middleware/auth';
import { requireAuth } from '../middleware/auth';
import { prisma } from '../services/prisma';

export const walletRouter = Router();

walletRouter.use(requireAuth);

walletRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const [user, paymentMethods, transactions] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: req.userId } }),
      prisma.paymentMethod.findMany({ where: { userId: req.userId } }),
      prisma.walletTransaction.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' }, take: 50 }),
    ]);

    res.json({
      balance: user.balanceKobo,
      currency: 'NGN',
      paymentMethods: paymentMethods.map((pm) => ({
        id: pm.id,
        type: pm.type.toLowerCase(),
        label: pm.label,
        isDefault: pm.isDefault,
      })),
      transactions: transactions.map((t) => ({
        id: t.id,
        kind: t.kind.toLowerCase(),
        label: t.label,
        amount: t.amountKobo,
        currency: 'NGN',
        createdAt: t.createdAt.toISOString(),
        relatedOrderId: t.relatedOrderId ?? undefined,
      })),
    });
  } catch (err) {
    next(err);
  }
});

const topUpSchema = z.object({
  amountKobo: z.number().int().positive().max(50_000_000), // ₦500,000 cap per top-up
});

walletRouter.post('/topup', async (req: AuthedRequest, res, next) => {
  try {
    const { amountKobo } = topUpSchema.parse(req.body);

    // In production: create a Paystack transaction here, return its
    // authorization_url to the client, and only credit the balance once the
    // webhook at POST /webhooks/paystack confirms a successful charge —
    // never trust a client-supplied "it succeeded" the way this stub does.
    const [, transaction] = await prisma.$transaction([
      prisma.user.update({ where: { id: req.userId }, data: { balanceKobo: { increment: amountKobo } } }),
      prisma.walletTransaction.create({
        data: { userId: req.userId!, kind: 'CREDIT', label: 'Wallet top-up (Paystack)', amountKobo },
      }),
    ]);

    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.userId } });
    res.json({ balance: user.balanceKobo, transactionId: transaction.id });
  } catch (err) {
    next(err);
  }
});
