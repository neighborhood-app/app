import {
  Neighborhood, Prisma, RequestStatus, User, Response, Request,
} from '@prisma/client';
import { Request as APIRequest } from 'express';

/**
 * format of the user data, without password hash, which is sent in response
 */
export type UserWithoutPasswordHash = Omit<User, 'password_hash'>;

/**
 * format of user data, without id, to create entry in users table
 */
export type UserWithoutId = Omit<User, 'id'>;

/**
 * Response type with the associated request
 */
export type ResponseWithRequest = Response & {
  request: Request
};

/**
 * format of the data sent to `POST /login` to login user
 */
export interface LoginData {
  username: string;
  password: string;
}

/**
 * format of the data sent to `POST /user` to create user
 */
export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Format of data sent to POST /api/neighborhood to create new neighborhood
 */
export interface CreateNeighborhoodData {
  admin_id: number;
  name: string;
}

/**
 * Request with token for authentication
 */
export interface RequestWithAuthentication extends APIRequest {
  token?: string;
  loggedUserId?: number;
}

const neighborhoodWithRelatedFields = Prisma.validator<Prisma.NeighborhoodArgs>()({
  include: {
    users: true,
    requests: true,
  },
});

export type NeighborhoodWithRelatedFields = Prisma.NeighborhoodGetPayload<
  typeof neighborhoodWithRelatedFields
>;

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

/**
 * format of neighborhood data, with all related fields, for members
 */
export type NeighborhoodDetailsForMembers = Prisma.NeighborhoodGetPayload<
  typeof neighborhoodDetailsForMembers
>;

const neighborhoodWithUsers = Prisma.validator<Prisma.NeighborhoodArgs>()({
  include: {
    users: true,
  },
});

/**
 * Neighborhood data with users
 */
export type NeighborhoodWithUsers = Prisma.NeighborhoodGetPayload<
  typeof neighborhoodWithUsers
>;

const userWithRequests = Prisma.validator<Prisma.UserArgs>()({
  include: {
    requests: true,
  },
});

/**
 * User data with requests
 */
export type UserWithRequests = Prisma.UserGetPayload<typeof userWithRequests>;

/**
 * post data for creating requests
 */
export type CreateRequestData = {
  title: string;
  content: string;
  neighborhoodId: number;
};

// replace above type with this
// export type CreateRequestData = Pick<Request, 'title' | 'content' | 'neighborhoodId'>;

/**
 * PUT data for updating a request
 */
export interface UpdateRequestData {
  title?: string;
  content?: string;
  status?: RequestStatus;
}

/**
 * shape of the Response data, only with the required `content` property
 * to create a Response
 */
export type ResponseData = Pick<Response, 'content' | 'request_id'>;

/**
 * shape of data for updating a Response
 */
export type UpdateResponseData = Pick<Partial<Response>, 'content' | 'status'>;
