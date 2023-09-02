/* eslint-disable import/no-anonymous-default-export */

import { getStoredUser } from "../utils/auth";
import axios from "axios";

const BASE_URL = "/api/neighborhoods";

async function getAllNeighborhoods() {
  const response = await axios.get(BASE_URL);
  return response.data;
}

// TODO: If unable to login because of token invalid or otherwise
// throw Error

// TODO: Provide appropriate return type and use it where this
// function is called
async function getSingleNeighborhood(id: Number) {
  let userDataInLocalStorage = getStoredUser();

  if (userDataInLocalStorage) {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${userDataInLocalStorage.token}` },
    });
    return response.data;
  }
}

export default { getAllNeighborhoods, getSingleNeighborhood };
