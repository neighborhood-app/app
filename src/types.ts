import { User } from '@prisma/client';

export type UserWithoutPasswordHash = Omit<User, 'password_hash'>;

export type UserWithoutId = Omit<User, 'id'>;

export interface LoginData {
  username: string,
  password: string
}

export interface CreateUserData {
  username: string,
  password: string
}
