import axios from "axios";

const baseURL = '/api/login'

async function login(username: string, password: string) {
  const response = await axios.post(baseURL, { username, password });
  return response.data;
}

export { login };