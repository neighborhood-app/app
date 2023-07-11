import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login, { action as loginAction } from './routes/login/login';
import TestRoute from './routes/test/test';
import PrivateRoutes from './routes/private_routes/privateRoutes';
import {
  createBrowserRouter, RouterProvider
} from 'react-router-dom';
import MainLayout from './components/MainLayout/MainLayout';
import Neighborhoods, {loader as neighborhoodsLoader} from './routes/neighborhoods/neighborhoods';
import Neighborhood, {loader as neighborhoodLoader} from './routes/individual_neighborhood/neighborhood';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
