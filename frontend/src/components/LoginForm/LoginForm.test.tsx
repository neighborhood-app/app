import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';
import loginService from '../../services/login'; 
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../../routes/login/login';

// Use screen.debug(element) if you want to check out the rendered HTML;

test('LoginForm is rendered', async () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginForm />,
    },
  ])

  render(<RouterProvider router={router} />);

  const form = screen.getByRole('form');
  const usernameInput = screen.getByLabelText(/^username/i);
  const passwordInput = screen.getByLabelText(/^password/i);

  expect(form).toBeDefined();
  expect(usernameInput).toBeDefined();
  expect(passwordInput).toBeDefined();
});