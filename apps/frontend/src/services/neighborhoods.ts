import axios from 'axios';
import { redirect } from 'react-router';
import { NeighborhoodsPerPage } from '@neighborhood/backend/src/types';
import { CreateNeighborhoodData, EditNeighborhoodData, NeighborhoodType } from '../types';
import { getStoredUser } from '../utils/auth';

const BASE_URL = '/api/neighborhoods';

async function getNeighborhoods(cursor?: number): Promise<NeighborhoodsPerPage> {
  const user = getStoredUser();
  const headers = { authorization: '' };

  if (user) headers.authorization = `Bearer ${user.token}`;

  const response = await axios.get(BASE_URL, { params: { cursor }, headers });
  return response.data;
}

// TODO: If unable to login because of token invalid or otherwise
// throw Error
async function getSingleNeighborhood(id: number): Promise<NeighborhoodType | null> {
  const userDataInLocalStorage = getStoredUser();

  if (userDataInLocalStorage) {
    const headers = { authorization: `Bearer ${userDataInLocalStorage.token}` };
    const response = await axios.get(`${BASE_URL}/${id}`, { headers });

    return response.data;
  }

  return null;
}

async function deleteNeighborhood(
  id: number,
): Promise<Response | { success: string } | { error: string }> {
  const user = getStoredUser();
  if (!user) return redirect('/login');

  const headers = { authorization: `Bearer ${user.token}` };
  await axios.delete(`${BASE_URL}/${id}`, { headers });

  return redirect('/');
}

async function createNeighborhood(
  neighborhoodData: CreateNeighborhoodData,
): Promise<Response | { success: string } | { error: string }> {
  const user = getStoredUser();
  if (!user) return redirect('/login');

  const headers = { authorization: `Bearer ${user.token}` };
  const response = await axios.post(`${BASE_URL}`, neighborhoodData, { headers });

  return response.data;
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

async function leaveNeighborhood(
  neighborhoodId: number,
): Promise<Response | { success: string } | { error: string }> {
  const user = getStoredUser();
  if (!user) return redirect('/login');

  const headers = { authorization: `Bearer ${user.token}` };
  await axios.put(`${BASE_URL}/${neighborhoodId}/leave`, null, { headers });

  return redirect('/');
}

async function editNeighborhood(
  neighborhoodId: number,
  neighborhoodData: EditNeighborhoodData,
): Promise<Response | { success: string } | { error: string }> {
  const user = getStoredUser();
  if (!user) return redirect('/login');

  const headers = { authorization: `Bearer ${user.token}` };
  const response = await axios.put(`${BASE_URL}/${neighborhoodId}`, neighborhoodData, { headers });

  return response.data;
}

export default {
  getNeighborhoods,
  getSingleNeighborhood,
  deleteNeighborhood,
  connectUserToNeighborhood,
  leaveNeighborhood,
  editNeighborhood,
  createNeighborhood,
};
