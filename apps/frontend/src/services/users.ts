import axios from 'axios';
import { UserWithRelatedData, UpdateUserInput, UserWithoutPasswordHash } from '@neighborhood/backend/src/types';
import { getStoredUser } from '../utils/auth';

const baseURL = '/api/users';

async function getUserData(id: number): Promise<UserWithRelatedData> {
  const headers: { authorization?: string } = {};
  const user = getStoredUser();

  if (user) {
    headers.authorization = `Bearer ${user.token}`;
  }

  const response = await axios.get(`${baseURL}/${id}`, { headers });

  return response.data;
}

async function updateProfile(updateProfileData: UpdateUserInput, userId: number): Promise<UserWithoutPasswordHash> {
  const headers: { authorization?: string } = {};
  const user = getStoredUser();

  if (user) {
    headers.authorization = `Bearer ${user.token}`;
  }

  const response = await axios.put(`${baseURL}/${userId}`, updateProfileData, { headers });

  return response.data;
}

export default { getUserData, updateProfile };
