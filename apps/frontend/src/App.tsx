import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootLayout/RootLayout";
import LoginPage, { action as loginAction } from "./pages/LoginPage/LoginPage";

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
import { checkAuthLoader } from "./utils/auth";
import HomePage from "./pages/HomePage/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login", // No need to give absolute path to children elements
        element: <LoginPage />,
        action: loginAction,
      },
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
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
