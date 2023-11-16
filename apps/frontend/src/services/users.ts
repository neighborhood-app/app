import axios from 'axios';
import { UserWithRelatedData } from '@neighborhood/backend/src/types';
import { StorageWithUser, UserInfo } from '../types';

const baseURL = '/api/users';

async function getUserData(id: number): Promise<UserWithRelatedData> {
  const headers: { authorization?: string } = {};
  const { user }: { user?: string } = localStorage as StorageWithUser;

  if (user) {
    const userObj: UserInfo = JSON.parse(user);
    headers.authorization = `Bearer ${userObj.token}`;
  }

  const response = await axios.get(`${baseURL}/${id}`, { headers });

  return response.data;
}

export default { getUserData };
