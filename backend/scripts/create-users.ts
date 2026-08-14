/**
 * Script CLI para crear usuarios en la base de datos.
 *
 * Uso:
 *   pnpm run seed:user
 *   pnpm run seed:user -- --username admin --email admin@example.com --password secret --role ADMIN
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { env } from '../src/config/env';

// ─── Tipos ──────────────────────────────────────────────────────
interface UserArgs {
  username: string;
  email:    string;
  password: string;
  role:     'ADMIN' | 'USER';
}

// ─── Parsing de argumentos CLI ──────────────────────────────────
function parseArgs(): UserArgs {
  const args = process.argv.slice(2);

  const get = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  return {
    username: get('--username') ?? 'admin',
    email:    get('--email')    ?? 'admin@example.com',
    password: get('--password') ?? 'Admin1234!',
    role:     (get('--role') as 'ADMIN' | 'USER') ?? 'ADMIN',
  };
}

// ─── Main ────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const userArgs = parseArgs();

  // Validar rol
  if (!['ADMIN', 'USER'].includes(userArgs.role)) {
    console.error(`❌ Role inválido: "${userArgs.role}". Debe ser ADMIN o USER.`);
    process.exit(1);
  }

  const pool = new Pool({
    host:     env.DB_HOST,
    port:     env.DB_PORT,
    database: env.DB_NAME,
    user:     env.DB_USER,
    password: env.DB_PASSWORD,
  });

  try {
    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(userArgs.password, SALT_ROUNDS);

    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE
        SET username   = EXCLUDED.username,
            password   = EXCLUDED.password,
            role       = EXCLUDED.role,
            updated_at = NOW()
      RETURNING id, username, email, role, created_at
    `;

    const result = await pool.query(query, [
      userArgs.username,
      userArgs.email,
      hashedPassword,
      userArgs.role,
    ]);

    const user = result.rows[0];
    console.log('✅ Usuario creado/actualizado exitosamente:');
    console.table({
      id:         user.id,
      username:   user.username,
      email:      user.email,
      role:       user.role,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
