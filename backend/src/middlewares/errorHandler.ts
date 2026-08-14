import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  status?:     string;
}

/**
 * Middleware de manejo de errores global.
 * Debe registrarse después de todas las rutas en app.ts.
 */
export function errorHandler(
  err:  AppError,
  _req: Request,
  res:  Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const status     = err.status     ?? 'error';

  console.error(`[ErrorHandler] ${statusCode} — ${err.message}`, err.stack);

  res.status(statusCode).json({
    status,
    message: statusCode === 500
      ? 'Error interno del servidor.'
      : err.message,
  });
}
