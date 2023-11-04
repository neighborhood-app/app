import schema, { APIRequest } from '@neighborhood/backend/src/types';

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
export type NeighborhoodWithUsers = schema.Prisma.NeighborhoodGetPayload<typeof neighborhoodWithUsers>;

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


/* FRONTEND TYPES */

export type SignUpData = CreateUserData;

export interface RequestData {
  title: string;
  content: string;
  neighborhoodId?: number;
}

export interface RouteIdParameter {
  id: string;
}

export interface StorageWithUser extends Storage {
  user?: string;
}

export interface UserInfo {
  username: string;
  token: string;
}

export type NeighborhoodDetailsForMembers = {
  id: number;
  admin_id: number;
  name: string;
  description: string | null;
  location: string | null;
  admin: User;
  users: Array<User> | null;
  requests: Array<RequestType> | null;
};

export type NeighborhoodType = NeighborhoodDetailsForMembers | NeighborhoodDetailsForNonMembers;

export type RequestType = {
  id: number;
  neighborhood_id: number;
  user_id: number;
  title: string;
  content: string;
  status: string;
  time_created: string;
  user: User;
  responses: Array<ResponseWithUserAndRequest>;
};

// use this instead of RequestType

export interface RequestWithUserAndResponses extends Request {
  user: User;
  responses: ResponseWithUserAndRequest[];
}

export interface ResponseWithUserAndRequest extends Response {
  user: User;
  request: RequestType;
};

export interface URLParameterID {
  id: string;
}

export interface StoredUserData extends UserInfo {
  id: string;
}

export type SingleNeighborhoodFormIntent =
  | 'create-request'
  | 'join-neighborhood'
  | 'accept-offer'
  | 'delete-response'
  | null;

export enum UserRole {
  'NON-MEMBER' = 'NON-MEMBER',
  'MEMBER' = 'MEMBER',
  'ADMIN' = 'ADMIN',
}