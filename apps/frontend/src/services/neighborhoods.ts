/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const baseURL = '/api/neighborhoods'

async function getAllNeighborhoods() {
  const response = await axios.get(baseURL);
  return response.data;
}

async function getSingleNeighborhood(id: Number) {
  const response = await axios.get(`${baseURL}/${id}`);
  return response.data;
}

export default { getAllNeighborhoods, getSingleNeighborhood };