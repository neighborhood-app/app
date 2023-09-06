import axios from "axios";
import { LoginData, StorageWithUser, UserInfo } from "../types";

const baseURL = "/api/login";

async function login(loginData: LoginData) {
  const headers: { authorization?: string } = {};
  let { user }: { user?: string } = localStorage as StorageWithUser;

  if (user) {
    const userObj: UserInfo = JSON.parse(user);
    headers.authorization = `Bearer ${userObj.token}`;
  }

  const response = await axios.post(baseURL, loginData, { headers });

  return response.data;
}

export default login;
