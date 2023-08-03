import { useContext } from "react";
import { UserContext } from "./contexts";

/**
 * Checks the context for a logged user and returns user data.
 * @returns users stored in context
 */
function useLoggedUser() {
    return useContext(UserContext);
};

export {useLoggedUser};