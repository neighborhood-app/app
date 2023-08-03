import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import LoginForm from './LoginForm'; 
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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