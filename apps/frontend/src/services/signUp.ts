import axios, { AxiosError } from 'axios';
import { redirect } from 'react-router';
import { UserWithoutPasswordHash, LoginData } from '@neighborhood/backend/src/types';
import { ErrorObj, SignUpData, UserInfo } from '../types';
import login from './login';

const baseURL = '/api/users';

async function signUp(signUpData: SignUpData) {
  
  try {
    const newUser: UserWithoutPasswordHash = await axios.post(baseURL, signUpData);

    if (newUser) {
      const loginData: LoginData = {
        username: signUpData.username,
        password: signUpData.password,
      };
      // there is duplication from the login action
      // is there a better way to do this?
      const loginResponse: UserInfo | ErrorObj = await login(loginData);

      if ('username' in loginResponse) {
        window.localStorage.setItem('user', JSON.stringify(loginResponse));
        return redirect('/');
      }
    }
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
    
    console.error(error);
    throw error;
  }

  return null;
}

export default signUp;
