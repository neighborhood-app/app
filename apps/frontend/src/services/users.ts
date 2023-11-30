import axios from 'axios';
import { UserWithRelatedData } from '@neighborhood/backend/src/types';
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

export default { getUserData };
