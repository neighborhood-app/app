export interface LoginData {
  username: string,
  password: string
};

export interface StorageWithUser extends Storage {
  user?: string
};

export interface UserInfo {
  username: string,
  token: string
};

export type NeighborhoodType = {
  id: number
  admin_id: number
  name: string
  description: string | null
  location: string | null
}

export type NeighborhoodDetailsForMembers = {
  id: number
  admin_id: number
  name: string
  description: string | null
  location: string | null
  admin: string | null,
  users: Array<string> | null,
  requests: Array<string> | null,
}

export type NeighborhoodDetailsForNonMembers = {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
}

export type User = {
  id: number
  user_name: string
  password_hash: string
  first_name: string | null
  last_name: string | null
  dob: Date | null
  gender_id: number | null
  bio: string | null
}

export type Request = {
  id: number;
  neighborhood_id: number;
  user_id: number;
  title: string;
  content: string;
  status: string;
  time_created: Date;
  user: User
}
