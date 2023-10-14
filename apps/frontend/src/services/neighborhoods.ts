import { redirect } from 'react-router';
import axios from 'axios';
import { Neighborhood } from '@prisma/client';
import { getStoredUser } from '../utils/auth';
import { NeighborhoodDetailsForMembers, NeighborhoodDetailsForNonMembers } from '../types';

const BASE_URL = '/api/neighborhoods';

async function getAllNeighborhoods(): Promise<Neighborhood[]> {
  const response = await axios.get(BASE_URL);
  return response.data;
}

// TODO: If unable to login because of token invalid or otherwise
// throw Error
async function getSingleNeighborhood(
  id: Number,
): Promise<NeighborhoodDetailsForMembers | NeighborhoodDetailsForNonMembers | null> {
  const userDataInLocalStorage = getStoredUser();

  if (userDataInLocalStorage) {
    const headers = { authorization: `Bearer ${userDataInLocalStorage.token}` };
    const response = await axios.get(`${BASE_URL}/${id}`, { headers });
    return response.data;
  }

  return null;
}

async function connectUserToNeighborhood(
  neighborhoodId: number,
): Promise<Response | { success: string } | { error: string }> {
  const user = getStoredUser();
  if (!user) return redirect('/login');

  const headers = { authorization: `Bearer ${user.token}` };
  const response = await axios.post(`${BASE_URL}/${neighborhoodId}/join`, null, { headers });

  return response.data;
}

export default {
  getAllNeighborhoods,
  getSingleNeighborhood,
  connectUserToNeighborhood,
};
