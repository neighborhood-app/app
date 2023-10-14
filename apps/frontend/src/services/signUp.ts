import axios from 'axios';
import { redirect } from 'react-router';
import { UserWithoutPasswordHash } from '@neighborhood/backend/src/types';
import { LoginData, SignUpData, UserInfo } from '../types';
import login from './login';

const baseURL = '/api/users';

async function signUp(signUpData: SignUpData) {
  const newUser: UserWithoutPasswordHash = await axios.post(baseURL, signUpData);
  if (newUser) {
    const loginData: LoginData = {
      username: signUpData.username,
      password: signUpData.password,
    };

    // there is duplication from the login action
    // is there a better way to do this?
    const user: UserInfo = await login(loginData);

    if (user) {
      window.localStorage.setItem('user', JSON.stringify(user));
      return redirect('/');
    }
  }

  return null;
}

export default signUp;
