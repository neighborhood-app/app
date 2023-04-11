import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import prismaClient from '../model/prismaClient';
import { NewUserData, UserWithoutPasswordHash, LoginData } from '../types';

/**
 * - narrows username type to string, checks if username is valid
 * - throws Error if username already exists
 * - throws Error if username not valid
 * @param username this should be a valid username
 * @returns resolved promise with username as value
 */
const parseUsername = async (username: unknown): Promise<string> => {
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
const getPasswordHash = async (password: unknown): Promise<string> => {
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

/**
 * - generates the new user data from req.body
 * - throws Error if username or password missing
 * - individual field parsers throw Error if unable to parse field
 * @param object req.body
 * @returns Promise which is resolved to the NewUserData
 */
const generateNewUserData = async (object: unknown): Promise<NewUserData> => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('username' in object && 'password' in object) {
    const userData = {
      user_name: await parseUsername(object.username),
      password_hash: await getPasswordHash(object.password),
      first_name: null,
      last_name: null,
      dob: null,
      gender_id: null,
      bio: null,
    };

    return Promise.resolve(userData);
  }

  const error = new Error('Username or Password missing');
  error.name = 'UserDataError';
  throw error;
};

/**
 * @param user user details while creating user
 * @returns a new user details object without password_hash field
 */
const getUserWithoutPasswordHash = (user: User): UserWithoutPasswordHash => {
  const userWithoutPasswordHash: UserWithoutPasswordHash = {
    id: user.id,
    user_name: user.user_name,
    first_name: user.first_name,
    last_name: user.last_name,
    dob: user.dob,
    gender_id: user.gender_id,
    bio: user.bio,
  };

  return userWithoutPasswordHash;
};

const generateLoginData = async (object: unknown): Promise<LoginData> => {
  if (!object || typeof object !== 'object') {
    const error = new Error('Username or Password Invalid');
    error.name = 'UserDataError';
    throw error;
  }

  if ('username' in object
      && 'password' in object
      && typeof object.username === 'string'
      && typeof object.password === 'string') {
    const loginData = {
      username: object.username,
      password: object.password,
    };
    return Promise.resolve(loginData);
  }

  const error = new Error('Username or Password Invalid');
  error.name = 'UserDataError';
  throw error;
};

export default {
  generateNewUserData,
  getUserWithoutPasswordHash,
  generateLoginData,
};
