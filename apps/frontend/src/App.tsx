import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppPage from "./pages/AppPage";
import Login, { action as loginAction } from "./pages/login/login";

import TestRoute from "./pages/test/test";
import PrivateRoutes from "./pages/private_routes/privateRoutes";

import Neighborhoods, {
  loader as neighborhoodsLoader,
} from "./pages/neighborhoods/neighborhoods";
import Neighborhood, {
  loader as neighborhoodLoader,
} from "./pages/individual_neighborhood/neighborhood";
import { action as requestAction } from "./pages/individual_neighborhood/neighborhood";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppPage />,
    children: [
      {
        path: "login", // No need to give absolute path to children elements
        element: <Login />,
        action: loginAction,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "/test",
            element: <TestRoute />,
          },
          {
            path: "/neighborhoods",
            loader: neighborhoodsLoader,
            element: <Neighborhoods />,
          },
          {
            path: "/neighborhoods/:id",
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
