import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login, {action as loginAction} from './routes/login';
import {
  createBrowserRouter, RouterProvider
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Placeholder!</div>
  },
  {
    path: "/login",
    element: <Login />,
    action: loginAction,
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
