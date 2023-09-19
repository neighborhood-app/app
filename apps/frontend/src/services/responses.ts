import axios from "axios";
import { StorageWithUser, UserInfo } from "../types";

const baseURL = '/api/responses';

async function acceptResponse(responseId: string) {
  const headers: { authorization?: string } = {};
  let { user }: { user?: string } = localStorage as StorageWithUser;

  if (user) {
    const userObj: UserInfo = JSON.parse(user);
    headers.authorization = `Bearer ${userObj.token}`;
  }

  const response = await axios.put(`${baseURL}/${responseId}`, { status: 'ACCEPTED' }, { headers });

  return response.data;
}

export default acceptResponse;