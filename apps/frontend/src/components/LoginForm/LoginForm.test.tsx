import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginForm from './LoginForm';

// Use screen.debug(element) if you want to check out the rendered HTML;

// className is added to LoginForm to avoid error
// but the required classes for styling have not been provided
test('LoginForm is rendered', async () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LoginForm isLoading={false} setIsLoading={() => {}} className="" />,
    },
  ]);

  render(<RouterProvider router={router} />);

  const form = screen.getByRole('form');
  const usernameInput = screen.getByLabelText(/^username/i);
  const passwordInput = screen.getByLabelText(/^password/i);

  expect(form).toBeDefined();
  expect(usernameInput).toBeDefined();
  expect(passwordInput).toBeDefined();
});
