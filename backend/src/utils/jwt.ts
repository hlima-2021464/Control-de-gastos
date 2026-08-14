import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  sub:      number;   // user id
  username: string;
  role:     string;
}

/**
 * Firma un JWT con HS256 a partir del payload dado.
 */
export function signToken(payload: TokenPayload): string {
  const options: SignOptions = {
    algorithm:  'HS256',
    expiresIn:  env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

/**
 * Verifica y decodifica un JWT.
 * Lanza JsonWebTokenError / TokenExpiredError si es inválido.
 */
export function verifyToken(token: string): JwtPayload & TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload & TokenPayload;
}
