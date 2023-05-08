import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';
import loginService from '../services/login'; 

// Use screen.debug(element) if you want to check out the rendered HTML;

test('LoginForm is rendered', async () => {
  render(<LoginForm />);

  const form = screen.getByRole('form');
  const usernameInput = screen.getByLabelText(/^username/i);
  const passwordInput = screen.getByLabelText(/^password/i);

  expect(form).toBeDefined();
  expect(usernameInput).toBeDefined();
  expect(passwordInput).toBeDefined();
});

test('Login service is called when form is submitted', async () => {
  render(<LoginForm />);

  const spyLogin = jest.spyOn(loginService, 'login');

  const form = screen.getByRole('form');
  const usernameInput = screen.getByLabelText(/^username/i);
  const passwordInput = screen.getByLabelText(/^password/i);

  const user = userEvent.setup();
  const button = screen.getByRole('button');

  await user.click(button);
  expect(spyLogin).toBeCalled();

  expect(form).toBeDefined();
  expect(usernameInput).toBeDefined();
  expect(passwordInput).toBeDefined();
});