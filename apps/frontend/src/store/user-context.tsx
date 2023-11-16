import { createContext, useState, useEffect, PropsWithChildren, useContext } from 'react';
import { getStoredUser } from '../utils/auth';

const UserContext = createContext({
  username: '',
  token: '',
  id: ''
});

export function useUser() {
  return useContext(UserContext);
}

export const UserContextProvider = (props: PropsWithChildren) => {
  const [username, setUser] = useState('');
  const [token, setToken] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    const storedUserInfo = getStoredUser();

    if (storedUserInfo) {
      setUser(storedUserInfo.username);
      setToken(storedUserInfo.token);
      setId(String(storedUserInfo.id));
    }
  }, []);

  return <UserContext.Provider value={{ username, token, id }}>{props.children}</UserContext.Provider>;
};
