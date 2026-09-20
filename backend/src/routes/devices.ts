import { Router } from 'express';
import { z } from 'zod';

import type { AuthedRequest } from '../middleware/auth';
import { requireAuth } from '../middleware/auth';
import { prisma } from '../services/prisma';

export const devicesRouter = Router();

devicesRouter.use(requireAuth);

const registerSchema = z.object({
  token: z.string().min(1),
  platform: z.enum(['IOS', 'ANDROID']),
});

devicesRouter.post('/', async (req: AuthedRequest, res, next) => {
  try {
    const { token, platform } = registerSchema.parse(req.body);
    await prisma.deviceToken.upsert({
      where: { token },
      update: { userId: req.userId!, platform },
      create: { userId: req.userId!, token, platform },
    });
    res.json({ registered: true });
  } catch (err) {
    next(err);
  }
});
