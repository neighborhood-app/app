import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import { UserContextProvider } from './store/user-context';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <UserContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </UserContextProvider>,
);
