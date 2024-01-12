import axios from 'axios';
import { getStoredUser } from '../utils/auth';

const BASE_URL = '/api/notifications';

async function joinNeighborhood(neighborhoodId: number) {
  // make a request to the backend
  // create function `askAdminPermissionToJoin`
  // make a POST request to a route that merely triggers a notification for the admin
  // once the admin accepts, make a POST request to add user as neighborhood member

  const user = getStoredUser();
  const headers = { authorization: '' };

  if (user) headers.authorization = `Bearer ${user.token}`;

  const response = await axios.post(`${BASE_URL}/join-neighborhood/${neighborhoodId}`, null, { headers });
  return response.data;
}

export default {
  joinNeighborhood,
}
