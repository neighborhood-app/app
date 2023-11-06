import axios from 'axios';
import { Request, CreateRequestData } from '@neighborhood/backend/src/types';
import { StorageWithUser, UserInfo, FullRequestData } from '../types';
import { getStoredUser } from '../utils/auth';

const BASE_URL = '/api/requests';

async function getSingleRequest(id: Number): Promise<FullRequestData | null> {
  const user = getStoredUser();

  if (user) {
    const headers = { authorization: `Bearer ${user.token}` };
    const response = await axios.get(`${BASE_URL}/${id}`, { headers });
    return response.data;
  }

  return null;
}

async function createRequest(requestData: CreateRequestData): Promise<Request> {
  const headers: { authorization?: string } = {};
  const { user }: { user?: string } = localStorage as StorageWithUser;

  if (user) {
    const userObj: UserInfo = JSON.parse(user);
    headers.authorization = `Bearer ${userObj.token}`;
  }

  const response = await axios.post(BASE_URL, requestData, { headers });

  return response.data;
}

async function closeRequest(requestId: string) {
  const headers: { authorization?: string } = {};
  const { user }: { user?: string } = localStorage as StorageWithUser;

  if (user) {
    const userObj: UserInfo = JSON.parse(user);
    headers.authorization = `Bearer ${userObj.token}`;
  }

  const response = await axios.put(`${BASE_URL}/${requestId}`, { status: 'CLOSED' }, { headers });

  return response.data;
}

async function deleteRequest(requestId: string) {
  const headers: { authorization?: string } = {};
  const { user }: { user?: string } = localStorage as StorageWithUser;

  if (user) {
    const userObj: UserInfo = JSON.parse(user);
    headers.authorization = `Bearer ${userObj.token}`;
  }

  const response = await axios.delete(`${BASE_URL}/${requestId}`, { headers });

  return response.data;
}

export default { getSingleRequest, createRequest, closeRequest, deleteRequest };
