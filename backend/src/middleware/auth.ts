import type { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '../services/jwt';

export interface AuthedRequest extends Request {
  userId?: string;
  userRole?: 'CUSTOMER' | 'DRIVER';
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }
  try {
    const payload = verifyAccessToken(header.slice('Bearer '.length));
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
