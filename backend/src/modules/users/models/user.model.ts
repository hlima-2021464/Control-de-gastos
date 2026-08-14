// =============================================================
// User domain models
// =============================================================

export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id:         number;
  username:   string;
  email:      string;
  password:   string;   // hashed
  role:       UserRole;
  created_at: Date;
  updated_at: Date;
}

/** Perfil de usuario sin información sensible */
export type UserWithoutPassword = Omit<User, 'password'>;
