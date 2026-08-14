import bcrypt from 'bcryptjs';
import { findByEmailOrUsername } from '../../users/repositories/user.repository';
import { signToken } from '../../../utils/jwt';
import { UserWithoutPassword } from '../../users/models/user.model';

export interface LoginResult {
  user:  UserWithoutPassword;
  token: string;
}

/**
 * Valida las credenciales del usuario y retorna un token JWT.
 * Lanza Error con mensaje adecuado si las credenciales son inválidas.
 */
export async function login(
  identifier: string,
  password:   string
): Promise<LoginResult> {
  // 1. Buscar usuario
  const user = await findByEmailOrUsername(identifier);
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // 2. Comparar contraseña
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // 3. Generar token
  const token = signToken({
    sub:      user.id,
    username: user.username,
    role:     user.role,
  });

  // 4. Retornar perfil sin password
  const { password: _password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}
