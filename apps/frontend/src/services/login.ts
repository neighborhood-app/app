import axios from "axios";
import { LoginData } from "../types";

const baseURL = "/api/login";

async function login(loginData: LoginData) {  
  const response = await axios.post(baseURL, loginData);
  return response.data;
}

export default login;
