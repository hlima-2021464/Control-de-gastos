import { Request, Response } from 'express';
import { Router } from 'express';
import { authMiddleware } from '../../../middlewares/auth.middleware';

const router = Router();

// Aplicar authMiddleware a todas las rutas de usuarios
router.use(authMiddleware);

/**
 * @route  GET /api/users
 * @desc   Listar usuarios (solo ADMIN) — placeholder
 * @access Private (ADMIN)
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status:  'success',
    message: 'Módulo de usuarios — en construcción.',
    data:    [],
  });
});

/**
 * @route  GET /api/users/:id
 * @desc   Obtener usuario por ID — placeholder
 * @access Private
 */
router.get('/:id', (_req: Request, res: Response) => {
  res.status(200).json({
    status:  'success',
    message: 'Detalle de usuario — en construcción.',
    data:    null,
  });
});

export default router;
