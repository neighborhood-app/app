import axios from 'axios';
import { UserWithoutPasswordHash } from '@neighborhood/backend/src/types';
import { getStoredUser } from '../utils/auth';

const BASE_URL = '/api/users';

async function getSingleUser(id: string): Promise<UserWithoutPasswordHash | null> {
  const user = getStoredUser();

  if (user) {
    const headers = { authorization: `Bearer ${user.token}` };
    const response = await axios.get(`${BASE_URL}/${id}`, { headers });
    return response.data;
  }

  return null;
}

export default {getSingleUser};