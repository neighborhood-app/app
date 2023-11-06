import axios from 'axios';
import { LoginResponseData, LoginData } from '@neighborhood/backend/src/types';

const baseURL = '/api/login';

async function login(loginData: LoginData): Promise<LoginResponseData> {
  const response = await axios.post(baseURL, loginData);
  return response.data;
}

export default login;
