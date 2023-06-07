import axios from "axios";
import { LoginData, StorageWithUser, UserInfo } from "../types";

const baseURL = '/api/login';

async function login(loginData: LoginData) {
  const headers: { authorization?: string } = {};
  let { user }: { user?: string } = localStorage as StorageWithUser;

  console.log('user', user);
  
  if (user) {
    const userObj: UserInfo = JSON.parse(user);
    console.log({ userObj });

    headers.authorization = `Bearer ${userObj.token}`;
  }

  const response = await axios.post(baseURL, loginData, { headers });
  console.log(response.data);

  return response.data;
}

export default login;