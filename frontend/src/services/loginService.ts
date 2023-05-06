import axios from "axios";

const baseURL = '/api/login'

async function login(username: string, password: string) {
  const user = await axios.post(baseURL, { username, password });
  return user;
}

export { login };