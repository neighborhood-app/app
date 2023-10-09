import { Response } from "@prisma/client"
import { CreateUserData } from '@neighborhood/backend/src/types';
import { User } from '@prisma/client';

export interface LoginData {
  username: string;
  password: string;
}

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
  requests: Array<string> | null;
};

export type NeighborhoodDetailsForNonMembers = {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
};

export type NeighborhoodType =
  | NeighborhoodDetailsForMembers
  | NeighborhoodDetailsForNonMembers;

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

export type ResponseWithUserAndRequest = Response & {
  user: User;
  request: RequestType;
}

export interface URLParameterID {
  id: string;
}

export interface StoredUserData {
  username: string;
  token: string;
  id: string;
}

export enum UserRole {
  "NON-MEMBER" = "NON-MEMBER",
  "MEMBER" = "MEMBER",
  "ADMIN" = "ADMIN",
}
