import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import React from 'react';

const PrivateRoutes = () => {  
  //@ts-ignore
  let auth = JSON.parse(window.localStorage.getItem('user'));
  const [userContext, setUserContext] = React.useState(auth);
  if (auth) {
      if (auth.token) {
        return <Outlet context={[userContext, setUserContext]}/>;
      } else {
        return (<Navigate to='/login'/>)
      }
  }
  return <Navigate to='/login' />
}

export default PrivateRoutes;