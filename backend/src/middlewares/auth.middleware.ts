import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { verifyToken, TokenPayload } from '../utils/jwt';

// Extender Request para incluir el payload del usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware de autenticación JWT.
 * - Extrae el Bearer token del header Authorization.
 * - Verifica y decodifica el token.
 * - Captura TokenExpiredError → 401 con mensaje específico.
 * - Captura JsonWebTokenError → 401 genérico.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      statusCode: 401,
      message: 'Token de acceso requerido.',
      error: 'Unauthorized',
    });
    return;
  }

  const token = authHeader.slice(7); // Quitar "Bearer "

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        statusCode: 401,
        message: 'su sesion haexpirado, por favor vuelva a iniciar sesión',
        error: 'TokenExpiredError',
      });
      return;
    }

    if (err instanceof JsonWebTokenError) {
      res.status(401).json({
        statusCode: 401,
        message: 'Token inválido o malformado.',
        error: 'JsonWebTokenError',
      });
      return;
    }

    next(err);
  }
}
