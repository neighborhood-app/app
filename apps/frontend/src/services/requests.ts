import axios from "axios";
import { RequestData, StorageWithUser, UserInfo } from "../types";

const baseURL = '/api/requests';

async function createRequest(requestData: RequestData) {
  const headers: { authorization?: string } = {};
  let { user }: { user?: string } = localStorage as StorageWithUser;
  
  if (user) {
    const userObj: UserInfo = JSON.parse(user);
    headers.authorization = `Bearer ${userObj.token}`;
  }

  const response = await axios.post(baseURL, requestData, { headers });

  return response.data;
}

export default createRequest;