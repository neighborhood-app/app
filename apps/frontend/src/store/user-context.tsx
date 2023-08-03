import {
  createContext,
  useState,
  useEffect,
  PropsWithChildren,
  useContext,
} from "react";
import { getStoredUser } from "../utils/auth";

const UserContext = createContext({
  username: "",
  token: "",
});

export function useUser() {
  return useContext(UserContext);
}

export const UserContextProvider = (props: PropsWithChildren) => {
  const [username, setUser] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedUserInfo = getStoredUser();

    if (storedUserInfo) {
      setUser(storedUserInfo.username);
      setToken(storedUserInfo.token);
    }
  }, []);

  return (
    <UserContext.Provider value={{ username, token }}>
      {props.children}
    </UserContext.Provider>
  );
};
