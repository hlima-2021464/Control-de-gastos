import { Router } from 'express';
import { loginHandler } from '../controllers/auth.controller';

const router = Router();

/**
 * @route  POST /api/auth/login
 * @desc   Autenticar usuario y obtener token JWT
 * @access Public
 */
router.post('/login', loginHandler);

export default router;
