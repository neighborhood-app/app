import axios, { AxiosError } from 'axios';
import { redirect } from 'react-router';
import { LatLngBounds } from 'leaflet';
import { Neighborhood, NeighborhoodsPerPage } from '@neighborhood/backend/src/types';
import { CreateNeighborhoodData, EditNeighborhoodData, ErrorObj, NeighborhoodType } from '../types';
import { getStoredUser } from '../utils/auth';

const BASE_URL = '/api/neighborhoods';

async function getNeighborhoods(cursor?: number): Promise<NeighborhoodsPerPage> {
  const user = getStoredUser();
  const headers = { authorization: '' };

  if (user) headers.authorization = `Bearer ${user.token}`;

  const response = await axios.get(BASE_URL, { params: { cursor }, headers });
  return response.data;
}

async function filterByName(searchTerm: string): Promise<Neighborhood[]> {
  const user = getStoredUser();
  const headers = { authorization: '' };

  if (user) headers.authorization = `Bearer ${user.token}`;

  const response = await axios.get(BASE_URL, { params: { searchTerm }, headers });

  return response.data;
}

async function filterByLocation(mapBounds: LatLngBounds): Promise<Neighborhood[]> {
  const user = getStoredUser();
  const headers = { authorization: '' };

  if (user) headers.authorization = `Bearer ${user.token}`;

  const response = await axios.get(BASE_URL, { params: { boundary: JSON.stringify(mapBounds) }, headers });

  return response.data;
}

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
): Promise<Response | { success: string } | ErrorObj> {
  const user = getStoredUser();
  if (!user) return redirect('/login');

  const headers = { authorization: `Bearer ${user.token}` };
  await axios.delete(`${BASE_URL}/${id}`, { headers });

  return redirect('/');
}

async function createNeighborhood(
  neighborhoodData: CreateNeighborhoodData,
): Promise<Response | { success: string } | ErrorObj> {
  const user = getStoredUser();
  if (!user) return redirect('/login');

  neighborhoodData.location = neighborhoodData.location ? neighborhoodData.location : null

  const headers = { authorization: `Bearer ${user.token}` };
  const response = await axios.post(`${BASE_URL}`, neighborhoodData, { headers });
  
  return response.data;
}

async function connectUserToNeighborhood(
  userId: number,
  neighborhoodId: number,
): Promise<Response | { success: string } | ErrorObj> {
  const user = getStoredUser();
  if (!user) return redirect('/login');
  
  const headers = { authorization: `Bearer ${user.token}` };
  const response = await axios.post(`${BASE_URL}/${neighborhoodId}/join/${userId}`, null, { headers });

  return response.data;
}

async function leaveNeighborhood(
  neighborhoodId: number,
): Promise<Response | { success: string } | ErrorObj> {
  const user = getStoredUser();
  if (!user) return redirect('/login');

  const headers = { authorization: `Bearer ${user.token}` };
  await axios.put(`${BASE_URL}/${neighborhoodId}/leave`, null, { headers });

  return redirect('/');
}

async function editNeighborhood(
  neighborhoodId: number,
  neighborhoodData: EditNeighborhoodData,
): Promise<Response | { success: string } | ErrorObj> {
  const user = getStoredUser();
  if (!user) return redirect('/login');
  
  neighborhoodData.location = neighborhoodData.location ? neighborhoodData.location : null

  const headers = { authorization: `Bearer ${user.token}` };
  let response;
  try {
    response = await axios.put(`${BASE_URL}/${neighborhoodId}`, neighborhoodData, { headers });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) return error.response?.data;

    throw error;
  }
}

export default {
  getNeighborhoods,
  filterByName,
  filterByLocation,
  getSingleNeighborhood,
  deleteNeighborhood,
  connectUserToNeighborhood,
  leaveNeighborhood,
  editNeighborhood,
  createNeighborhood,
};
