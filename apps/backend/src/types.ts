import {
  Neighborhood, Prisma, Status, User,
} from '@prisma/client';
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

/**
 * Request with token for authentication
 */
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

export type NeighborhoodWithRelatedFields = Prisma
  .NeighborhoodGetPayload<typeof neighborhoodWithRelatedFields>;

/**
 * format of the neighborhood data, without admin_id, to be displayed for non members
 */
export type NeighborhoodDetailsForNonMembers = Omit<Neighborhood, 'admin_id'>;

const neighborhoodDetailsForMembers = Prisma.validator<Prisma.NeighborhoodArgs>()({
  include: {
    admin: true,
    users: true,
    requests: true,
  },
});

export interface CreateRequestData {
  neighborhood_id: number,
  title: string,
  content: string
}

export interface UpdateRequestData {
  title?: string,
  content?: string,
  status?: Status
}

/**
 * format of neighborhood data, with all related fields, for members
 */
export type NeighborhoodDetailsForMembers = Prisma
  .NeighborhoodGetPayload<typeof neighborhoodDetailsForMembers>;

const neighborhoodWithUsers = Prisma.validator<Prisma.NeighborhoodArgs>()({
  include: {
    users: true,
  },
});

export type NeighborhoodWithUsers = Prisma
  .NeighborhoodGetPayload<typeof neighborhoodWithUsers>;

//
const userWithRequests = Prisma.validator<Prisma.UserArgs>()({
  include: {
    requests: true,
  },
});

export type UserWithRequests = Prisma
  .UserGetPayload<typeof userWithRequests>;
