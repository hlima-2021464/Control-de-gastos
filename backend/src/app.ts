import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env';
import authRoutes from './modules/auth/routes/auth.routes';
import usersRoutes from './modules/users/routes/users.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// ─── Middlewares globales ────────────────────────────────────────
app.use(cors({
  origin:      env.CORS_ORIGIN,
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Rutas ──────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    service:   'control-de-gastos-api',
  });
});

// ─── 404 ────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status:  'error',
    message: 'Ruta no encontrada.',
  });
});

// ─── Error Handler (debe ir al final) ───────────────────────────
app.use(errorHandler);

export default app;
