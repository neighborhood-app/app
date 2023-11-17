import axios from 'axios';
import { Response, ResponseData } from '@neighborhood/backend/src/types';
import { getStoredUser } from '../utils/auth';

const baseURL = '/api/responses';
const user = getStoredUser();

async function createResponse(responseInput: ResponseData): Promise<Response | { error: string }> {
  const headers: { authorization?: string } = {};

  if (user) {
    headers.authorization = `Bearer ${user.token}`;
  }

  const response = await axios.post(baseURL, responseInput, { headers });

  return response.data;
}

async function acceptResponse(responseId: string): Promise<Response | { error: string }> {
  const headers: { authorization?: string } = {};

  if (user) {
    headers.authorization = `Bearer ${user.token}`;
  }

  const response = await axios.put(`${baseURL}/${responseId}`, { status: 'ACCEPTED' }, { headers });

  return response.data;
}

async function deleteResponse(responseId: string): Promise<'' | { error: string }> {
  const headers: { authorization?: string } = {};

  if (user) {
    headers.authorization = `Bearer ${user.token}`;
  }

  const response = await axios.delete(`${baseURL}/${responseId}`, { headers });

  return response.data;
}

export default { acceptResponse, deleteResponse, createResponse };
