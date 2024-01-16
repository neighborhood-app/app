import axios from 'axios';
import { getStoredUser } from '../utils/auth';

const BASE_URL = '/api/notifications';

async function joinNeighborhood(neighborhoodId: number) {
  const user = getStoredUser();
  const headers = { authorization: '' };

  if (user) headers.authorization = `Bearer ${user.token}`;

  const response = await axios.post(`${BASE_URL}/join-neighborhood/${neighborhoodId}`, null, {
    headers,
  });
  return response.data;
}

async function updateAction(notificationId: string, btnType: string, status: string) {
  const user = getStoredUser();
  const headers = { authorization: '' };
  const data = { notificationId, btnType, status };

  if (user) headers.authorization = `Bearer ${user.token}`;

  const response = await axios.post(`${BASE_URL}/mark-action-done`, data, {
    headers,
  });

  return response.data;
}

export default {
  joinNeighborhood,
  updateAction,
};
