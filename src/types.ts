import { User } from '@prisma/client';

/**
 * format of the user data, without password hash, which is send in response
 */
export type UserWithoutPasswordHash = Omit<User, 'password_hash'>;

/**
 * format of user data, without id, to create entry in users table
 */
export type UserWithoutId = Omit<User, 'id'>;

/**
 * format of the data sent to `POST /login` to login user
 */
export interface LoginData {
  username: string,
  password: string
}

/**
 * format of the data sent to `POST /user` to create user
 */
export interface CreateUserData {
  username: string,
  password: string
}
