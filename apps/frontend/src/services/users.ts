import axios, { AxiosError } from 'axios';
import { UserWithRelatedData, UserWithoutPasswordHash } from '@neighborhood/backend/src/types';
import { getStoredUser } from '../utils/auth';
import { ErrorObj, UpdateUserInput } from '../types';

const baseURL = `${process.env.REACT_APP_API}/api/users`;

async function getUserData(id: number): Promise<UserWithRelatedData> {
  const headers: { authorization?: string } = {};
  const user = getStoredUser();

  if (user) {
    headers.authorization = `Bearer ${user.token}`;
  }

  const response = await axios.get(`${baseURL}/${id}`, { headers });

  return response.data;
}

async function updateProfile(updateProfileData: UpdateUserInput | FormData, userId: number): Promise<UserWithoutPasswordHash | ErrorObj> {
  const headers: { authorization?: string } = {};
  const user = getStoredUser();

  if (user) {
    headers.authorization = `Bearer ${user.token}`;
  }
  try {  
    const response = await axios.put(`${baseURL}/${userId}`, updateProfileData, { headers });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data
    }

    throw error;
  }
}

export default { getUserData, updateProfile };
