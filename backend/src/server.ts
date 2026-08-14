import { env } from './config/env';
import app from './app';
import { testConnection } from './db/pool';

async function bootstrap(): Promise<void> {
  // Verificar conexión a PostgreSQL antes de aceptar peticiones
  await testConnection();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    console.log(`📋 Health check: http://localhost:${env.PORT}/api/health`);
    console.log(`🔐 Auth endpoint: http://localhost:${env.PORT}/api/auth/login`);
    console.log(`🌍 Environment: ${process.env['NODE_ENV'] ?? 'development'}`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
