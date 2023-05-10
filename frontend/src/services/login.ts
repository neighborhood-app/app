import axios from "axios";
import { LoginData } from "../types";

const baseURL = '/api/login'

async function login(loginData: LoginData) {
  const { username, password } = loginData;
  const response = await axios.post(baseURL, { username, password });
  return response.data;
}

export default { login };