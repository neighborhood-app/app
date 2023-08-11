/* eslint-disable import/no-anonymous-default-export */
import { getStoredUser } from "../utils/auth";
import axios from "axios";

const baseURL = '/api/neighborhoods'
let userData = getStoredUser();

async function getAllNeighborhoods() {
  const response = await axios.get(baseURL);
  return response.data;
}

async function getSingleNeighborhood(id: Number) {
  if (userData) {
    const response = await axios.get(`${baseURL}/${id}`, {headers: {'Authorization': `Bearer ${userData.token}`}});
    return response.data;
  }
}

export default { getAllNeighborhoods, getSingleNeighborhood };