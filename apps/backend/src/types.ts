import * as schema from '@prisma/client';
import { Request as APIRequest } from 'express';

/**
 * format of the user data, without password hash, which is sent in response
 */
// export type UserWithoutPasswordHash = Omit<User, 'password_hash'>;

// /**
//  * format of user data, without id, to create entry in users table
//  */
// export type UserWithoutId = Omit<User, 'id'>;

// /**
//  * Response type with the associated request
//  */
// export type ResponseWithRequest = Response & {
//   request: Request;
// };

// /**
//  * format of the data sent to `POST /login` to login user
//  */
// export interface LoginData {
//   username: string;
//   password: string;
// }

// /**
//  * format of the data sent to `POST /user` to create user
//  */
// export interface CreateUserData {
//   username: string;
//   email: string;
//   password: string;
//   firstName?: string;
//   lastName?: string;
// }

// /**
//  * Format of data sent to POST /api/neighborhood to create new neighborhood
//  */
// export interface CreateNeighborhoodData {
//   admin_id: number;
//   name: string;
// }

// /**
//  * Request with token for authentication
//  */
// export interface RequestWithAuthentication extends APIRequest {
//   token?: string;
//   loggedUserId?: number;
// }

// const neighborhoodWithRelatedFields = Prisma.validator<Prisma.NeighborhoodArgs>()({
//   include: {
//     users: true,
//     requests: true,
//   },
// });

// export type NeighborhoodWithRelatedFields = Prisma.NeighborhoodGetPayload<
//   typeof neighborhoodWithRelatedFields
// >;

// /**
//  * format of the neighborhood data, without admin_id, to be displayed for non members
//  */
// export type NeighborhoodDetailsForNonMembers = Omit<Neighborhood, 'admin_id'>;

// const neighborhoodDetailsForMembers = Prisma.validator<Prisma.NeighborhoodArgs>()({
//   include: {
//     admin: true,
//     users: true,
//     requests: true,
//   },
// });

// /**
//  * format of neighborhood data, with all related fields, for members
//  */
// export type NeighborhoodDetailsForMembers = Prisma.NeighborhoodGetPayload<
//   typeof neighborhoodDetailsForMembers
// >;

// const neighborhoodWithUsers = Prisma.validator<Prisma.NeighborhoodArgs>()({
//   include: {
//     users: true,
//   },
// });

// /**
//  * Neighborhood data with users
//  */
// export type NeighborhoodWithUsers = Prisma.NeighborhoodGetPayload<typeof neighborhoodWithUsers>;

// const userWithRequests = Prisma.validator<Prisma.UserArgs>()({
//   include: {
//     requests: true,
//   },
// });

// /**
//  * User data with requests
//  */
// export type UserWithRequests = Prisma.UserGetPayload<typeof userWithRequests>;

// /**
//  * post data for creating requests
//  */
// export type CreateRequestData = {
//   title: string;
//   content: string;
//   neighborhoodId: number;
// };

// // replace above type with this
// // export type CreateRequestData = Pick<Request, 'title' | 'content' | 'neighborhoodId'>;

// /**
//  * PUT data for updating a request
//  */
// export interface UpdateRequestData {
//   title?: string;
//   content?: string;
//   status?: RequestStatus;
// }

// /**
//  * shape of the Response data, only with the required `content` property
//  * to create a Response
//  */
// export type ResponseData = Pick<Response, 'content' | 'request_id'>;

// /**
//  * shape of data for updating a Response
//  */
// export type UpdateResponseData = Pick<Partial<Response>, 'content' | 'status'>;

// /**
//  * Represents the status of a user in the context of a reponse.
//  * It is used when updating a response.
//  * A reponse owner can update any field of the response.
//  * A request owner of the associated response can only update its status.
//  */
// export type UserStatusOnResponse = 'RESPONSE OWNER' | 'REQUEST OWNER';

// /**
//  * Shape of data returned as a response after a successful login
//  */
// export interface LoginResponseData {
//   id: number;
//   username: string;
//   token: string;
// }


export type User = schema.User;
export type Request = schema.Request;
export type Response = schema.Response;
export type Neighborhood = schema.Neighborhood;

/**
 * format of the user data, without password hash, which is sent in response
 */
export type UserWithoutPasswordHash = Omit<User, 'password_hash'>;

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

const userWithRequests = schema.Prisma.validator<schema.Prisma.UserArgs>()({
  include: {
    requests: true,
  },
});

/**
 * User type with Requests
 */
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
// Use StoredUserData instead of this type
export interface LoginResponseData {
  id: number;
  username: string;
  token: string;
}
