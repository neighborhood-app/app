import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  //@ts-ignore
  let auth = JSON.parse(window.localStorage.getItem('loggedNeighborhoodUser'));
  if (auth) {
    return (
    //@ts-ignore
      auth.token ? <Outlet/> : <Navigate to='/login'/>
    )
  }
  return <Navigate to='/login' />
}

export default PrivateRoutes;