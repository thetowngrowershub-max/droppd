import { Router } from 'express';
import { z } from 'zod';

import { HttpError } from '../middleware/errorHandler';
import { prisma } from '../services/prisma';
import { requestOtp, verifyOtpCode } from '../services/otp';
import { signAccessToken, signRefreshToken } from '../services/jwt';

export const authRouter = Router();

const NG_PHONE_REGEX = /^\+234[789][01]\d{8}$/;

const requestOtpSchema = z.object({
  phone: z.string().regex(NG_PHONE_REGEX, 'Must be a valid Nigerian phone number in E.164 format'),
});

authRouter.post('/otp/request', async (req, res, next) => {
  try {
    const { phone } = requestOtpSchema.parse(req.body);
    await requestOtp(phone);
    res.json({ sent: true });
  } catch (err) {
    next(err);
  }
});

const verifyOtpSchema = z.object({
  phone: z.string().regex(NG_PHONE_REGEX),
  code: z.string().length(6),
  role: z.enum(['CUSTOMER', 'DRIVER']),
});

authRouter.post('/otp/verify', async (req, res, next) => {
  try {
    const { phone, code, role } = verifyOtpSchema.parse(req.body);

    if (!verifyOtpCode(phone, code)) {
      throw new HttpError(400, 'Incorrect or expired code');
    }

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          role,
          phone,
          // Placeholder values — the client should prompt to complete these
          // via PATCH /account/me right after first sign-up.
          fullName: 'New User',
          email: `${phone.replace('+', '')}@pending.droppd.ng`,
          avatarInitials: 'NU',
          vehicleType: role === 'DRIVER' ? 'BIKE' : undefined,
        },
      });
    }

    const tokenPayload = { sub: user.id, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    res.json({
      token: accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      user: {
        id: user.id,
        role: user.role.toLowerCase(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarInitials: user.avatarInitials,
        rating: user.rating,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
});
