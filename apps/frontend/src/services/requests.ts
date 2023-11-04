import axios from 'axios';
import { Request } from '@neighborhood/backend/src/types';
import { RequestData, StorageWithUser, UserInfo } from '../types';

const baseURL = '/api/requests';

async function createRequest(requestData: RequestData): Promise<Request> {
  const headers: { authorization?: string } = {};
  const { user }: { user?: string } = localStorage as StorageWithUser;

  if (user) {
    const userObj: UserInfo = JSON.parse(user);
    headers.authorization = `Bearer ${userObj.token}`;
  }

  const response = await axios.post(baseURL, requestData, { headers });

  return response.data;
}

async function closeRequest(requestId: string) {
  const headers: { authorization?: string } = {};
  const { user }: { user?: string } = localStorage as StorageWithUser;

  if (user) {
    const userObj: UserInfo = JSON.parse(user);
    headers.authorization = `Bearer ${userObj.token}`;
  }

  const response = await axios.put(`${baseURL}/${requestId}`, { status: 'CLOSED' }, { headers });

  return response.data;
}

async function deleteRequest(requestId: string) {
  const headers: { authorization?: string } = {};
  const { user }: { user?: string } = localStorage as StorageWithUser;

  if (user) {
    const userObj: UserInfo = JSON.parse(user);
    headers.authorization = `Bearer ${userObj.token}`;
  }

  const response = await axios.delete(`${baseURL}/${requestId}`, { headers });

  return response.data;
}

export default { createRequest, closeRequest, deleteRequest };
