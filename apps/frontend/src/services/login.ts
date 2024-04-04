import axios, { AxiosError } from 'axios';
import { LoginResponseData, LoginData } from '@neighborhood/backend/src/types';
import { ErrorObj } from '../types';

const baseURL = `${process.env.REACT_APP_API}/api/login`;

async function login(loginData: LoginData): Promise<LoginResponseData | ErrorObj> {
  try { 
    const response = await axios.post(baseURL, loginData);  
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;

    console.error(error);
    throw error;
  }
}

export default login;
