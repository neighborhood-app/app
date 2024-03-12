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

// do we need authorization here?
async function joinReqAccepted(userId: number, neighborhoodId: number) {
  const user = getStoredUser();
  const headers = { authorization: '' };

  if (user) headers.authorization = `Bearer ${user.token}`;

  const response = await axios.post(
    `${BASE_URL}/join-accepted/${neighborhoodId}`,
    { userId },
    {
      headers,
    },
  );

  return response.data;
}

async function createRequest(requestId: any, neighborhoodId: number) {
  try {
    const user = getStoredUser();
    const headers = { authorization: '' };

    if (user) headers.authorization = `Bearer ${user.token}`;
    await axios.post(
      `${BASE_URL}/create-request/${requestId}`,
      { neighborhoodId },
      {
        headers,
      },
    );
  } catch (error: unknown) {
    console.error(error);
  }
}

async function receiveResponse(requestId: number) {
  try {
    const user = getStoredUser();
    const headers = { authorization: '' };

    if (user) headers.authorization = `Bearer ${user.token}`;
    await axios.post(`${BASE_URL}/receive-response/${requestId}`, null, {
      headers,
    });
  } catch (error: unknown) {
    console.error(error);
  }
}

async function responseAccepted(requestId: number, responseId: number) {
  try {
    const user = getStoredUser();
    const headers = { authorization: '' };

    if (user) headers.authorization = `Bearer ${user.token}`;
    await axios.post(
      `${BASE_URL}/response-accepted/${responseId}`,
      { requestId },
      {
        headers,
      },
    );
  } catch (error: unknown) {
    console.error(error);
  }
}

export default {
  joinNeighborhood,
  joinReqAccepted,
  createRequest,
  receiveResponse,
  responseAccepted,
};
