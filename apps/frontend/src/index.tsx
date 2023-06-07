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

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
      path: "/login",
      element: <Login />,
      action: loginAction,
    },
    {
      path: "/",
      element: <PrivateRoutes/>,
      children: [
        {
          path: "/test",
          element: <TestRoute />
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
