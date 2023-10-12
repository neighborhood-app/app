import axios from "axios";
import { getStoredUser } from "../utils/auth";

const baseURL = "/api/responses";
let user = getStoredUser();

async function acceptResponse(responseId: string) {
  const headers: { authorization?: string } = {};

  if (user) {
    headers.authorization = `Bearer ${user.token}`;
  }

  const response = await axios.put(
    `${baseURL}/${responseId}`,
    { status: "ACCEPTED" },
    { headers }
  );

  return response.data;
}

async function deleteResponse(responseId: string) {
  const headers: { authorization?: string } = {};

  if (user) {
    headers.authorization = `Bearer ${user.token}`;
  }

  const response = await axios.delete(`${baseURL}/${responseId}`, { headers });

  return response.data;
}

export default { acceptResponse, deleteResponse };
