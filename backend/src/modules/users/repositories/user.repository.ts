import { pool } from '../../../db/pool';
import { User } from '../models/user.model';

/**
 * Busca un usuario por email o por username.
 * Retorna null si no existe.
 */
export async function findByEmailOrUsername(
  identifier: string
): Promise<User | null> {
  const query = `
    SELECT id, username, email, password, role, created_at, updated_at
    FROM   users
    WHERE  email = $1
       OR  username = $1
    LIMIT  1
  `;

  const result = await pool.query<User>(query, [identifier]);
  return result.rows[0] ?? null;
}
