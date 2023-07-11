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