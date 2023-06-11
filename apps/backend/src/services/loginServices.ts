import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { LoginData } from '../types';
import prismaClient from '../../prismaClient';
import config from '../utils/config';

/**
 * - performs input validation and type narrowing for data sent to POST /login in req.body
 * - if username, password present and of type string, then returns loginData
 * - else throws Error
 * @param body request.body should contain username and password
 * @returns Promise resolving to input data for POST /login
 */
const parseLoginData = async (body: unknown): Promise<LoginData> => {
  if (!body || typeof body !== 'object') {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  if ('username' in body && 'password' in body
    && typeof body.username === 'string'
    && typeof body.password === 'string') {
    const loginData: LoginData = {
      username: body.username,
      password: body.password,
    };

    return loginData;
  }

  const error = new Error('unable to parse data');
  error.name = 'InvalidInputError';
  throw error;
};

/**
 * finds user in db by username
 * throws an error if username does not exist
 * @param username
 * @returns Promise resolving to user
 */
const findUserByUsername = async (username: string): Promise<User> => {
  // using findUnique because we want to throw custom 401 error
  const user: User | null = await prismaClient.user.findUnique({
    where: {
      user_name: username,
    },
  });

  if (user) return user;

  const error = new Error('invalid username or password');
  error.name = 'InvalidUserameOrPasswordError';
  throw error;
};

/**
 * checks if password matches the password hash according to bcrypt encryption
 * @param password
 * @param password_hash
 * @returns true if password matches
 */
const isPasswordCorrect = async (password: string, password_hash: string)
: Promise<Boolean> => bcrypt.compare(password, password_hash);

/**
 * generates a json web token valid for 1 hour corresponding to userName and id
 * @param username
 * @param userId
 * @returns Promise resolving to the token
 */
const generateToken = async (username: string, userId: number): Promise<string> => {
  const userDataForGeneratingToken = {
    username,
    id: userId,
  };

  // config.SECRET could be undefined
  const secret = config.SECRET as string;

  const token = jsonwebtoken.sign(
    userDataForGeneratingToken,
    secret,
    // { expiresIn: '1h' }, // token expires in 1 hour
    { expiresIn: '1000h' }, // token expires in 1000 hours while dev
  );

  return token;
};

export default {
  parseLoginData,
  findUserByUsername,
  isPasswordCorrect,
  generateToken,
};
