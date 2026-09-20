import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../env';

export interface AccessTokenPayload {
  sub: string; // user id
  role: 'CUSTOMER' | 'DRIVER';
}

// @types/jsonwebtoken types `expiresIn` as a branded string (from the `ms`
// package) rather than a plain `string`, which our env-loaded config can
// never satisfy structurally — cast at the boundary rather than losing the
// plain `string` type for JWT_EXPIRES_IN everywhere else.
const accessTokenExpiry = env.JWT_EXPIRES_IN as SignOptions['expiresIn'];
const refreshTokenExpiry = env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'];

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: accessTokenExpiry });
}

export function signRefreshToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: refreshTokenExpiry });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as AccessTokenPayload;
}
