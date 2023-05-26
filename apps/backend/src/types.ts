import { Prisma, User } from '@prisma/client';
import { Request } from 'express';

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

/**
 * Format of data sent to POST /api/neighborhood to create new neighborhood
 */
export interface CreateNeighborhoodData {
  admin_id: number,
  name: string
}

export interface CustomRequest extends Request {
  token?: string,
  user?: User
}

export interface RequestWithAuthentication extends Request {
  token?: string,
  loggedUserId?: number
}

const neighborhoodWithRelatedFields = Prisma.validator<Prisma.NeighborhoodArgs>()({
  include: {
    users: true,
    requests: true,
  },
});

// const NeighborhoodRelatedFields = Prisma.validator<Prisma.NeighborhoodArgs>()({
//   select: { admin: true },
// });

export type NeighborhoodWithRelatedFields = Prisma
  .NeighborhoodGetPayload<typeof neighborhoodWithRelatedFields>;
