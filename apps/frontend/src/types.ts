export interface LoginData {
  username: string;
  password: string;
}

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
  admin: string | null;
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

export type User = {
  id: number;
  user_name: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  dob: Date | null;
  gender_id: number | null;
  bio: string | null;
};

export type RequestType = {
  id: number;
  neighborhood_id: number;
  user_id: number;
  title: string;
  content: string;
  status: string;
  time_created: string;
  user: User;
};

export interface URLParameterID {
  id: string;
}

export interface StoredUserData {
  username: string;
  token: string;
}
