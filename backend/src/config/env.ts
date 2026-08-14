import 'dotenv/config';

interface Env {
  PORT:         number;
  CORS_ORIGIN:  string;
  DB_HOST:      string;
  DB_PORT:      number;
  DB_NAME:      string;
  DB_USER:      string;
  DB_PASSWORD:  string;
  JWT_SECRET:   string;
  JWT_EXPIRES_IN: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function requireEnvInt(name: string, fallback?: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${name}`);
  }
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be an integer, got: "${raw}"`);
  }
  return parsed;
}

export const env: Readonly<Env> = {
  PORT:           requireEnvInt('PORT', 3000),
  CORS_ORIGIN:    process.env['CORS_ORIGIN'] ?? 'http://localhost:4200',
  DB_HOST:        requireEnv('DB_HOST'),
  DB_PORT:        requireEnvInt('DB_PORT', 5432),
  DB_NAME:        requireEnv('DB_NAME'),
  DB_USER:        requireEnv('DB_USER'),
  DB_PASSWORD:    requireEnv('DB_PASSWORD'),
  JWT_SECRET:     requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] ?? '8h',
};
