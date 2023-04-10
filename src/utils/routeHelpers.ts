import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { NewUserData, UserWithoutPasswordHash } from '../types';

/**
 * - generates the new user data from req.body
 * - throws Error if username or password missing
 * - individual field parsers throw Error if unable to parse field
 * @param object req.body
 * @returns Promise which is resolved to the NewUserData
 */
const generateNewUserData = async (object: unknown): Promise<NewUserData> => {
  /**
 * - narrows type of password to string, generates password hash from the password in req.body
 * - throws error if password is missing or invalid ie less than 4 characters
 * @param password from req.body
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
 * - narrows username type to string, returns username if its present in req.body and valid
 * - else, throws an Error
 * @param username from req.body
 * @returns valid username
 */
  const parseUsername = (username: unknown): string => {
    const MINIMUM_USERNAME_LENGTH = 4;
    if (typeof username !== 'string' || username.length < MINIMUM_USERNAME_LENGTH) {
      const error = new Error('Invalid Username');
      error.name = 'UserDataError';
      throw error;
    }

    return username;
  };

  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('username' in object && 'password' in object) {
    const userData = {
      user_name: parseUsername(object.username),
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

export default {
  generateNewUserData,
  getUserWithoutPasswordHash,
};
