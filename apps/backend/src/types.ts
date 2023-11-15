import * as schema from '@prisma/client';
import { Request as APIRequest } from 'express';

export type User = schema.User;
export type Request = schema.Request;
export type Response = schema.Response;
export type Neighborhood = schema.Neighborhood;

/**
 * format of the User data, without password hash, which is sent in response
 */
export type UserWithoutPasswordHash = Omit<User, 'password_hash'>;

export type UserWithRelatedData = UserWithoutPasswordHash & {neighborhoods: Neighborhood[], requests: Request[]}

/**
 * format of user data, without id, to create entry in users table
 */
export type UserWithoutId = Omit<User, 'id'>;

/**
 * Response type with the associated Request
 */
export interface ResponseWithRequest extends Response {
  request: Request;
}

/**
 * Response type with the associated User
 */
const responseWithUser = schema.Prisma.validator<schema.Prisma.ResponseArgs>()({
  include: {
    user: true,
  },
});

export type ResponseWithUser = schema.Prisma.ResponseGetPayload<typeof responseWithUser>;

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
export type CreateNeighborhoodData = Pick<Neighborhood, 'admin_id' | 'name'>;

/**
 * Request with token for authentication
 */
export interface RequestWithAuthentication extends APIRequest {
  token?: string;
  loggedUserId?: number;
}

const neighborhoodWithRelatedFields = schema.Prisma.validator<schema.Prisma.NeighborhoodArgs>()({
  include: {
    users: true,
    requests: true,
  },
});

export type NeighborhoodWithRelatedFields = schema.Prisma.NeighborhoodGetPayload<
  typeof neighborhoodWithRelatedFields
>;

/**
 * format of the neighborhood data, without admin_id, to be displayed for non members
 */
export type NeighborhoodDetailsForNonMembers = Omit<Neighborhood, 'admin_id'>;

const neighborhoodDetailsForMembers = schema.Prisma.validator<schema.Prisma.NeighborhoodArgs>()({
  include: {
    admin: true,
    users: true,
    requests: true,
  },
});

/**
 * format of neighborhood data, with all related fields for members
 */
export type NeighborhoodDetailsForMembers = schema.Prisma.NeighborhoodGetPayload<
  typeof neighborhoodDetailsForMembers
>;

export type NeighborhoodType = NeighborhoodDetailsForMembers | NeighborhoodDetailsForNonMembers;

const neighborhoodWithUsers = schema.Prisma.validator<schema.Prisma.NeighborhoodArgs>()({
  include: {
    users: true,
  },
});

/**
 * Neighborhood type with users
 */
export type NeighborhoodWithUsers = schema.Prisma.NeighborhoodGetPayload<
  typeof neighborhoodWithUsers
>;

/**
 * User type with Requests
 */
const userWithRequests = schema.Prisma.validator<schema.Prisma.UserArgs>()({
  include: {
    requests: true,
  },
});

export type UserWithRequests = schema.Prisma.UserGetPayload<typeof userWithRequests>;

/**
 * POST data shape for creating requests
 */
export type CreateRequestData = Pick<Request, 'title' | 'content' | 'neighborhood_id'>;

/**
 * PUT data shape for updating a request
 */
export type UpdateRequestData = Pick<Partial<Request>, 'title' | 'content' | 'status'>;

/**
 * shape of the Response data, only with the required `content` and `request_id properties
 * to create a Response
 */
export type ResponseData = Pick<Response, 'content' | 'request_id'>;

/**
 * shape of data for updating a Response
 */
export type UpdateResponseData = Pick<Partial<Response>, 'content' | 'status'>;

/**
 * Represents the status of a user in the context of a Reponse.
 * It is used when updating a Response.
 * A reponse owner can update any field of the Response.
 * A request owner of the associated Response can only update its status.
 */
export type UserStatusOnResponse = 'RESPONSE OWNER' | 'REQUEST OWNER';

/**
 * Shape of data returned as a response after a successful login
 */
export interface LoginResponseData {
  id: string;
  username: string;
  token: string;
}
