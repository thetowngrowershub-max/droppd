import { Router } from 'express';
import { z } from 'zod';

import type { AuthedRequest } from '../middleware/auth';
import { requireAuth } from '../middleware/auth';
import { HttpError } from '../middleware/errorHandler';
import { prisma } from '../services/prisma';

export const accountRouter = Router();

accountRouter.use(requireAuth);

accountRouter.get('/me', async (req: AuthedRequest, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.userId } });
    res.json(serializeUser(user));
  } catch (err) {
    next(err);
  }
});

const updateSchema = z.object({
  fullName: z.string().min(1).max(120).optional(),
  email: z.string().email().optional(),
  vehiclePlate: z.string().max(20).optional(),
});

accountRouter.patch('/me', async (req: AuthedRequest, res, next) => {
  try {
    const patch = updateSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: req.userId }, data: patch });
    res.json(serializeUser(user));
  } catch (err) {
    next(err);
  }
});

// Apple App Store Review Guideline 5.1.1(v) and Google Play's Account
// Deletion policy both require an in-app, self-service way to delete an
// account — this is that endpoint. It cascade-deletes addresses, payment
// method references, wallet transactions and device tokens (see
// prisma/schema.prisma onDelete rules). Orders are cascade-deleted with the
// customer for this scaffold; before going to production, replace that with
// anonymizing completed orders instead, to honor the 7-year financial
// record-retention window called out in the Privacy Policy (docs/PRIVACY_POLICY.md §7).
accountRouter.delete('/me', async (req: AuthedRequest, res, next) => {
  try {
    if (!req.userId) throw new HttpError(401, 'Not authenticated');
    await prisma.user.delete({ where: { id: req.userId } });
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
});

function serializeUser(user: {
  id: string;
  role: string;
  fullName: string;
  email: string;
  phone: string;
  avatarInitials: string;
  rating: number;
  createdAt: Date;
  vehicleType: string | null;
  vehiclePlate: string | null;
  isOnline: boolean;
  totalDeliveries: number;
}) {
  const base = {
    id: user.id,
    role: user.role.toLowerCase(),
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatarInitials: user.avatarInitials,
    rating: user.rating,
    createdAt: user.createdAt.toISOString(),
  };
  if (user.role === 'DRIVER') {
    return {
      ...base,
      vehicleType: user.vehicleType?.toLowerCase(),
      vehiclePlate: user.vehiclePlate,
      isOnline: user.isOnline,
      totalDeliveries: user.totalDeliveries,
    };
  }
  return base;
}
