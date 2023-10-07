/* eslint-disable import/no-anonymous-default-export */
import { StorageWithUser, UserInfo } from '../types';
import { getStoredUser } from '../utils/auth';
import axios from 'axios';

const BASE_URL = '/api/neighborhoods';

async function getAllNeighborhoods() {
  const response = await axios.get(BASE_URL);
  return response.data;
}

// TODO: If unable to login because of token invalid or otherwise
// throw Error

// TODO: Provide appropriate return type and use it where this
// function is called
async function getSingleNeighborhood(id: Number) {
  let userDataInLocalStorage = getStoredUser();

  if (userDataInLocalStorage) {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${userDataInLocalStorage.token}` },
    });
    return response.data;
  }
}

async function connectUserToNeighborhood(neighborhoodId: number): Promise<{ success: string }> {
  const headers: { authorization?: string } = {};
  let { user }: { user?: string } = localStorage as StorageWithUser;
  

  if (user) {
    const userObj: UserInfo = JSON.parse(user);
    headers.authorization = `Bearer ${userObj.token}`;
  }

  const response = await axios.post(`${BASE_URL}/${neighborhoodId}/join`, null, { headers });

  return response.data;
}

export default {
  getAllNeighborhoods,
  getSingleNeighborhood,
  connectUserToNeighborhood,
};
