import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import LoginForm from './LoginForm'; 
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Use screen.debug(element) if you want to check out the rendered HTML;

// className is added to LoginForm to avoid error
// but the required classes for styling have not been provided
test('LoginForm is rendered', async () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginForm className='' />,
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