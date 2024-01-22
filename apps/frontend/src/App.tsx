import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import RootLayout from './pages/RootLayout/RootLayout';
import LoginPage, { action as loginAction } from './pages/LoginPage/LoginPage';
import SignUpPage, { action as signUpAction } from './pages/SignUpPage/SignUpPage';

import SingleNeighborhoodPage, {
  loader as neighborhoodLoader,
  action as requestAction,
} from './pages/SingleNeighborhoodPage/SingleNeighborhoodPage';

import SingleRequestPage, {
  loader as requestLoader,
  action as singleRequestAction,
} from './pages/SingleRequestPage/SingleRequestPage';

import ProfilePage, {
  loader as userLoader,
  action as profileAction,
} from './pages/ProfilePage/ProfilePage';

import ErrorPage from './pages/ErrorPage/ErrorPage';
import logoutLoader from './pages/LogoutPage/LogoutPage';
import { redirectLoggedInUser, checkAuthLoader } from './utils/auth';

import ExplorePage, { loader as exploreLoader } from './pages/ExplorePage/ExplorePage';

import HomePage, {
  loader as homePageLoader,
  action as homePageAction,
} from './pages/HomePage/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        loader: checkAuthLoader,
        children: [
          {
            index: true,
            path: '/',
            element: <HomePage />,
            loader: homePageLoader,
            action: homePageAction,
          },
          { path: 'logout', loader: logoutLoader },
          {
            path: 'users/:id',
            element: <ProfilePage />,
            loader: userLoader,
            action: profileAction,
          },
          {
            path: 'explore/:cursor?',
            element: <ExplorePage />,
            loader: exploreLoader,
          },
          {
            path: 'neighborhoods/:id',
            loader: neighborhoodLoader,
            action: requestAction,
            element: <SingleNeighborhoodPage />,
          },
          {
            path: 'requests/:id',
            loader: requestLoader,
            action: singleRequestAction,
            element: <SingleRequestPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/login', // No need to give absolute path to children elements
    element: <LoginPage />,
    errorElement: <ErrorPage />,
    loader: redirectLoggedInUser,
    action: loginAction,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
    errorElement: <ErrorPage />,
    loader: redirectLoggedInUser,
    action: signUpAction,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
