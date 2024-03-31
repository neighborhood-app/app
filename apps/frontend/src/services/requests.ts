import axios from 'axios';
import { Request, CreateRequestData } from '@neighborhood/backend/src/types';
import { StorageWithUser, UserInfo, FullRequestData, EditRequestData } from '../types';
import { getStoredUser } from '../utils/auth';

const baseURL = `${process.env.REACT_APP_API}/api/requests`;

async function getSingleRequest(id: Number): Promise<FullRequestData | null> {
  const user = getStoredUser();

  if (user) {
    const headers = { authorization: `Bearer ${user.token}` };
    const response = await axios.get(`${baseURL}/${id}`, { headers });
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

  const response = await axios.post(baseURL, requestData, { headers });

  return response.data;
}

async function editRequest(requestData: EditRequestData, requestId: number): Promise<Request> {
  const headers: { authorization?: string } = {};
  const user = getStoredUser();

  if (user) {
    headers.authorization = `Bearer ${user.token}`;
  }

  const response = await axios.put(`${baseURL}/${requestId}`, requestData, { headers });

  return response.data;
}

async function closeRequest(requestId: number): Promise<Request> {
  const headers: { authorization?: string } = {};
  const user = getStoredUser();

  if (user) {
    headers.authorization = `Bearer ${user.token}`;
  }

  const response = await axios.put(`${baseURL}/${requestId}`, { status: 'CLOSED' }, { headers });

  return response.data;
}

async function deleteRequest(requestId: number) {
  const user = getStoredUser();
  const headers: { authorization?: string } = {};

  if (user) {
    headers.authorization = `Bearer ${user.token}`;
  }

  const response = await axios.delete(`${baseURL}/${requestId}`, { headers });

  return response.data;
}

export default { getSingleRequest, createRequest, editRequest, closeRequest, deleteRequest };
