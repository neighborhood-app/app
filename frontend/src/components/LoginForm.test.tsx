import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import LoginForm from './LoginForm';

test('LoginForm is rendered', () => {
  render(<LoginForm />);
  const form = screen.getByRole('form');
  const usernameInput = screen.getByLabelText(/^username/i);
  const passwordInput = screen.getByLabelText(/^password/i);

  expect(form).toBeDefined();
  expect(usernameInput).toBeDefined();
  expect(passwordInput).toBeDefined();
})