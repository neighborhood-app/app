import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootLayout/RootLayout";
import Login, { action as loginAction } from "./pages/login/login";

import TestRoute from "./pages/test/test";

import Neighborhoods, {
  loader as neighborhoodsLoader,
} from "./pages/neighborhoods/neighborhoods";

import Neighborhood, {
  loader as neighborhoodLoader,
} from "./pages/individual_neighborhood/neighborhood";
import { action as requestAction } from "./pages/individual_neighborhood/neighborhood";
import { loader as logoutLoader } from "./pages/Logout";
import { checkAuthLoader } from "./utils/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/login", // No need to give absolute path to children elements
        element: <Login />,
        action: loginAction,
      },
      {
        loader: checkAuthLoader,
        children: [
          { path: "logout", loader: logoutLoader },
          {
            path: "test",
            element: <TestRoute />,
          },
          {
            path: "neighborhoods",
            element: <Neighborhoods />,
            loader: neighborhoodsLoader,
          },
          {
            path: "neighborhoods/:id",
            loader: neighborhoodLoader,
            action: requestAction,
            element: <Neighborhood />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
