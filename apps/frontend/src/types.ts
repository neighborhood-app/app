import {
  Neighborhood,
  User,
  Request,
  CreateUserData,
  NeighborhoodDetailsForNonMembers,
  LoginResponseData,
  ResponseWithUser,
  NeighborhoodWithUsers,
} from '@neighborhood/backend/src/types';

export interface NeighborhoodDetailsForMembers extends Neighborhood {
  // do we need admin on top of admin_id?
  admin: User;
  users: Array<User> | null;
  requests: Array<RequestWithUserAndResponses> | null;
}

export type CreateNeighborhoodData = Pick<NeighborhoodDetailsForNonMembers, "name" | "description">

export type EditNeighborhoodData = CreateNeighborhoodData

export type NeighborhoodType = NeighborhoodDetailsForMembers | NeighborhoodDetailsForNonMembers;

export interface RequestWithUserAndResponses extends Omit<Request, 'time_created'> {
  time_created: string;
  user: User;
  responses: ResponseWithUser[];
}

export interface FullRequestData extends RequestWithUserAndResponses {
  neighborhood: NeighborhoodWithUsers
}

export type EditRequestData = Pick<Partial<Request>, 'title' | 'content'>;

export interface StorageWithUser extends Storage {
  user?: string;
}

export type StoredUserData = LoginResponseData;

export type SignUpData = CreateUserData;

export type UserInfo = Omit<StoredUserData, 'id'>;

export type SingleNeighborhoodFormIntent =
  | 'create-request'
  | 'join-neighborhood'
  | 'leave-neighborhood'
  | 'edit-neighborhood'
  | 'delete-neighborhood'
  ;

export type SingleRequestFormIntent =
  | 'edit-request'
  | 'delete-request'
  | 'close-request'
  | 'accept-offer'
  | 'create-response'
  | 'edit-response'
  | 'delete-response'
  ;

export type FormIntent = SingleNeighborhoodFormIntent | SingleRequestFormIntent;

export interface ErrorObj {
  error: string;
}

// this is a [bug](https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope)
// eslint-disable-next-line no-shadow
export type UserRole = 'NON-MEMBER' | 'MEMBER' | 'ADMIN'

// RequestWithUserAndResponses or just Request?
// export interface ResponseWithUserAndRequest extends Response {
//   user: User;
//   request: RequestWithUserAndResponses;
// }

// export interface RouteIdParameter {
//   id: string;
// }

// export interface URLParameterID {
//   id: string;
// }