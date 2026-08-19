import { Request, Response } from 'express';
import { Router } from 'express';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { requireRole } from '../../../middlewares/require-role.middleware';

const router = Router();

// Aplicar authMiddleware a todas las rutas de usuarios
router.use(authMiddleware);

/**
 * @route  GET /api/users
 * @desc   Listar usuarios — solo ADMIN
 * @access Private (ADMIN)
 */
router.get('/', requireRole('ADMIN'), (_req: Request, res: Response) => {
  res.status(200).json({
    status:  'success',
    message: 'Módulo de usuarios — en construcción.',
    data:    [],
  });
});

/**
 * @route  GET /api/users/me
 * @desc   Obtener perfil del usuario autenticado (sin exponer datos sensibles)
 * @access Private (ADMIN, USER)
 */
router.get('/me', requireRole('ADMIN', 'USER'), (req: Request, res: Response) => {
  // Retornar solo datos seguros del payload del token (sin password)
  const { sub, username, role } = req.user!;
  res.status(200).json({
    status: 'success',
    data: { id: sub, username, role },
  });
});

/**
 * @route  GET /api/users/:id
 * @desc   Obtener usuario por ID — solo ADMIN
 * @access Private (ADMIN)
 */
router.get('/:id', requireRole('ADMIN'), (_req: Request, res: Response) => {
  res.status(200).json({
    status:  'success',
    message: 'Detalle de usuario — en construcción.',
    data:    null,
  });
});

export default router;
