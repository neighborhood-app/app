import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login, { action as loginAction } from './pages/login/login';
import TestRoute from './pages/test/test';
import PrivateRoutes from './pages/private_routes/privateRoutes';
import {
  createBrowserRouter, RouterProvider
} from 'react-router-dom';
import App from './App';
import Neighborhoods, {loader as neighborhoodsLoader} from './pages/neighborhoods/neighborhoods';
import Neighborhood, {loader as neighborhoodLoader} from './pages/individual_neighborhood/neighborhood';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
        action: loginAction,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "/test",
            element: <TestRoute />
          },
          {
            path: "/neighborhoods",
            loader: neighborhoodsLoader,
            element: <Neighborhoods />
          },
          {
            path: "/neighborhoods/:id",
            loader: neighborhoodLoader,
            element: <Neighborhood />
          }
        ]
      }
    ]
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
