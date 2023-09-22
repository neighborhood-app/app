import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootLayout/RootLayout";
import LoginPage, { action as loginAction } from "./pages/LoginPage/LoginPage";
import SignUpPage, { action as signUpAction } from "./pages/SignUpPage/SignUpPage";

import TestPage from "./pages/Test/TestPage";

import NeighborhoodsPage, {
  loader as neighborhoodsLoader,
} from "./pages/NeighborhoodsPage/NeighborhoodsPage";

import SingleNeighborhoodPage, {
  loader as neighborhoodLoader,
  action as requestAction,
} from "./pages/SingleNeighborhoodPage/SingleNeighborhoodPage";

import ErrorPage from "./pages/ErrorPage/ErrorPage";

import { loader as logoutLoader } from "./pages/LogoutPage/LogoutPage";
import { redirectLoggedInUser, checkAuthLoader } from "./utils/auth";
import HomePage from "./pages/HomePage/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        loader: checkAuthLoader,
        children: [
          { path: "logout", loader: logoutLoader },
          {
            path: "test",
            element: <TestPage />,
          },
          {
            path: "neighborhoods",
            element: <NeighborhoodsPage />,
            loader: neighborhoodsLoader,
          },
          {
            path: "neighborhoods/:id",
            loader: neighborhoodLoader,
            action: requestAction,
            element: <SingleNeighborhoodPage />,
          },
          {
            path: "home",
            element: <HomePage />
          }
        ],
      },
    ],
  },
  {
    path: "/login", // No need to give absolute path to children elements
    element: <LoginPage />,
    errorElement: <ErrorPage />,
    loader: redirectLoggedInUser,
    action: loginAction,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
    errorElement: <ErrorPage />,
    loader: redirectLoggedInUser,
    action: signUpAction,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
