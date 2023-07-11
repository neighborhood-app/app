/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const baseURL = '/api/neighborhoods'
let user = localStorage.getItem('user');
//@ts-ignore
user = JSON.parse(user);
//@ts-ignore
let token;
if (user) {
  //@ts-ignore
  token = user.token;
}

async function getAllNeighborhoods() {
  const response = await axios.get(baseURL);
  return response.data;
}

async function getSingleNeighborhood(id: Number) {
  //@ts-ignore
  const response = await axios.get(`${baseURL}/${id}`, {headers: {'Authorization': `Bearer ${token}`}});
  return response.data;
}

export default { getAllNeighborhoods, getSingleNeighborhood };