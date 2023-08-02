import { redirect } from "react-router-dom";
import { StoredUserData } from "../types";

/**
 * - fetches user data from local storage
 * - NOTE : Checks only for the existence of user,
 * - NOTE : Does not check whether the user is currently logged in or not
 * - NOTE : Might return {username, token} which is now expired
 * - if user present, parses the JSON and returns logged user data
 * - else returns null
 */
export function getStoredUser(): StoredUserData | null {
  const user = window.localStorage.getItem("user");

  if (user) {
    return JSON.parse(user);
  } else {
    return null;
  }
}

// export function tokenLoader() {
//   return getAuthToken();
// }

/**
 * - checks for user in localStorage
 * - if user present, returns null
 * - else, redirects to '/'
 * @returns
 */
export function checkAuthLoader() {
  const user = getStoredUser();

  if (!user) {
    return redirect("/login");
  } else {
    return null;
  }
}
