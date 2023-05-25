import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateUserData, UserWithoutId, UserWithoutPasswordHash } from '../types';
import prismaClient from '../../prismaClient';

// helpers
const helpers: any = {};
/**
 * - narrows username type to string, checks if username is valid
 * - throws Error if username already exists
 * - throws Error if username not valid
 * @param username this should be a valid username
 * @returns resolved promise with username as value
 */
helpers.parseUsername = async (username: unknown): Promise<string> => {
  const MINIMUM_USERNAME_LENGTH = 4;
  if (typeof username !== 'string' || username.length < MINIMUM_USERNAME_LENGTH) {
    const error = new Error('Invalid Username');
    error.name = 'UserDataError';
    throw error;
  }

  const existingUser: User | null = await prismaClient.user.findUnique({
    where: {
      user_name: username,
    },
  });

  if (existingUser) {
    const error = new Error('User already exists');
    error.name = 'UserDataError';
    throw error;
  }

  return Promise.resolve(username);
};

/**
   * - narrows type of password to string, generates password hash from the password
   * - throws error if password is missing or invalid ie less than 4 characters
   * @param password this should be a valid password
   * @returns Promise resolved to password hash
   */
helpers.getPasswordHash = async (password: unknown): Promise<string> => {
  const MINIMUM_PASSWORD_LENGTH = 4;
  if (typeof password !== 'string' || password.length < MINIMUM_PASSWORD_LENGTH) {
    const error = new Error('Invalid Password');
    error.name = 'UserDataError';
    throw error;
  }

  const SALT_ROUNDS = 10;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return Promise.resolve(passwordHash);
};

// user services functions

/**
 * - performs type narrowing for data from req.body to POST /user
 * - if username, password present and of type string, then returns an body containing input data
 * - the mandatory fields can be changed in future
 * - else throws Error
 * @param body request.body should contain username and password
 * @returns Promise resolved to user input to POST /user
 */
const parseCreateUserData = async (body: unknown): Promise<CreateUserData> => {
  if (!body || typeof body !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('username' in body && 'password' in body
      && typeof body.username === 'string'
      && typeof body.password === 'string') {
    const createUserData = {
      username: body.username,
      password: body.password,
    };

    return Promise.resolve(createUserData);
  }

  const error = new Error('Username or Password missing');
  error.name = 'UserDataError';
  throw error;
};

/**
 * - performs input validation and
 * generates the new user data (without id) from valid input to POST /user
 * - throws Error if fields invalid (currently checks for username and password)
 * - other field parsers can be added in future
 * @param createUserData should contain all the necessary field of the required types
 * currently only username and password
 * @returns Promise with status resolved to the user data withouti d
 */
const generateUserDataWithoutId = async (createUserData: CreateUserData)
: Promise<UserWithoutId> => {
  const { username, password } = createUserData;
  const userData = {
    user_name: await helpers.parseUsername(username),
    password_hash: await helpers.getPasswordHash(password),
    first_name: null,
    last_name: null,
    dob: null,
    gender_id: null,
    bio: null,
  };

  return Promise.resolve(userData);
};

export default {
  parseCreateUserData,
  generateUserDataWithoutId,
};
