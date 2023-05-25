import { User } from '@prisma/client';
import { LoginData } from '../types';
import prismaClient from '../../prismaClient';

/**
 * - performs input validation and type narrowing for data sent to POST /login in req.body
 * - if username, password present and of type string, then returns an body containing input data
 * - else throws Error
 * @param body request.body should contain username and password
 * @returns Promise resolved to the input for POST /login
 */
const parseLoginData = async (body: unknown): Promise<LoginData> => {
  if (!body || typeof body !== 'object') {
    const error = new Error('Username or Password Invalid');
    error.name = 'InvalidInputError';
    throw error;
  }

  if ('username' in body && 'password' in body
      && typeof body.username === 'string'
      && typeof body.password === 'string') {
    const loginData = {
      username: body.username,
      password: body.password,
    };

    return Promise.resolve(loginData);
  }

  const error = new Error('Username or Password Invalid');
  error.name = 'InvalidInputError';
  throw error;
};

/**
 * @param username
 * @returns
 */
const findUserByUsername = async (username: string): Promise<User | null> => {
  const user = await prismaClient.user.findUnique({
    where: {
      user_name: username,
    },
  });

  return Promise.resolve(user);
};

export default {
  parseLoginData,
  findUserByUsername,
};
