import { Request, Response, NextFunction } from 'express';

/**
 * Middleware factory de autorización por rol.
 * Debe usarse DESPUÉS de authMiddleware (que inyecta req.user).
 *
 * Uso:
 *   router.get('/admin', authMiddleware, requireRole('ADMIN'), handler)
 *   router.get('/any',   authMiddleware, requireRole('ADMIN', 'USER'), handler)
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        statusCode: 401,
        message:    'No autenticado.',
        error:      'Unauthorized',
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        statusCode: 403,
        message:    `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}.`,
        error:      'Forbidden',
      });
      return;
    }

    next();
  };
}
