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

export interface RequestWithUserAndResponses extends Omit<Request, 'time_created'> {
  time_created: string;
  user: User;
  responses: ResponseWithUser[];
}

export interface RequestWithUser extends Omit<Request, 'time_created'> {
  time_created: string;
  user: User;
}

export type UserWithRelatedData = UserWithoutPasswordHash & {
  neighborhoods: Neighborhood[];
  requests: RequestWithUser[];
};

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
 * format of the data sent to `PUT /user/:id` to edit user
 */
export type UpdateUserInput = {
  first_name: string;
  last_name: string;
  bio: string;
  dob?: string;
  email: string;
};

export type UpdateUserData = {
  first_name: string;
  last_name: string;
  bio: string;
  dob?: Date;
  email: string;
};

/**
 * Format of data sent to POST /api/neighborhood to create new neighborhood
 */
export type CreateNeighborhoodData = Pick<Neighborhood, 'admin_id' | 'name' | 'description'> & {
  location: null | schema.Prisma.JsonValue;
};

/**
 * Request with token for authentication
 */
export interface RequestWithAuthentication extends APIRequest {
  token?: string;
  loggedUserId?: number;
  username?: string;
}

/**
 * Request with token for authentication and neighborhoodId
 */
export interface RequestWithAuthenticationAndId extends RequestWithAuthentication {
  neighborhoodId?: number;
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

/**
 * Neighborhood type with users
 */
const neighborhoodWithUsers = schema.Prisma.validator<schema.Prisma.NeighborhoodArgs>()({
  include: {
    users: true,
  },
});

export type NeighborhoodWithUsers = schema.Prisma.NeighborhoodGetPayload<
  typeof neighborhoodWithUsers
>;

/**
 * Request type with full data: user, responses, and neighborhood with users
 */
const requestFullData = schema.Prisma.validator<schema.Prisma.RequestArgs>()({
  include: {
    user: true,
    responses: true,
    neighborhood: {
      include: {
        users: true,
      },
    },
  },
});

export type FullRequestData = schema.Prisma.RequestGetPayload<typeof requestFullData>;

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
 * shape of the Response data, only with the required `content` and `request_id` properties
 * to create a Response
 */
export type ResponseData = Pick<Response, 'content' | 'request_id'>;

/**
 * shape of the data required to edit a response, only with the required `content` and `id` properties
 */
export type EditResponseData = Pick<Response, 'content' | 'id'>;

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
  id: number;
  username: string;
  token: string;
  hashedSubscriberId: string;
}

/**
 * Shape of data fetched when getting neighborhoods
 * currentCursor and hasNextPage are used to implement infinite scrolling
 */
export interface NeighborhoodsPerPage {
  neighborhoods: Neighborhood[];
  newCursor?: number;
  hasNextPage: boolean;
}

/**
 * Shape of data required to trigger a notification for joining a neighborhood
 */
export interface JoinNeighborhoodArgs {
  adminId: string;
  userId: string;
  neighborhoodId: string;
  neighborhoodName: string;
  username: string;
}

/**
 * Shape of a Novu Subcriber
 */
export interface Subscriber {
  _id: string;
  _organizationId: string;
  _environmentId: string;
  firstName: string;
  lastName: string;
  subscriberId: string;
  channels: [];
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  data: {
    username: string;
  };
  __v: number;
}

/*
 * Shape of a Novu Topic
 */
export interface Topic {
  _id: string;
  _environmentId: string;
  _organizationId: string;
  key: string;
  name: string;
  subscribers: string[];
}

/*
 * Shape of Notification data returned from `getNotificationsFeed`
 */
export interface Notification {
  cta: {
    action: { status: 'pending' | 'done' };
  };
  templateIdentifier: string;
  status: string;
  payload: {
    neighborhoodId: string;
    neighborhoodName: string;
    username: string;
    userId: string;
  };
}

/*
 * Shape of Notification data needed to find identical notification
 */
export interface NotificationFilterData {
  status: 'pending' | 'done';
  templateIdentifier: string;
  neighborhoodId: string;
  userId: string;
}
