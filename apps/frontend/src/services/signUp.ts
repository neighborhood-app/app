import axios from "axios";
import { SignUpData } from "../types";

const baseURL = "/api/users";

async function signUp(signUpData: SignUpData) {  
  // const headers: { authorization?: string } = {};
  // let { user }: { user?: string } = localStorage as StorageWithUser;

  // if (user) {
  //   const userObj: UserInfo = JSON.parse(user);
  //   headers.authorization = `Bearer ${userObj.token}`;
  // }

  const response = await axios.post(baseURL, signUpData);
  return response.data;
}

export default signUp;
