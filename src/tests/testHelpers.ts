import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserWithoutId } from '../types';
import prismaClient from '../model/prismaClient';

/**
 * Generates a password hash using bcrypt library and 10 salt rounds
 * @param password plain-text password to generate hash
 * @returns Promise resolved to password-hash
 */
const getPasswordHash = async (password: string) => {
  const SALT_ROUNDS = 10;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return Promise.resolve(passwordHash);
};

/**
 * - Generates user data from input to populate user table during test
 * - only input and password required, rest values are null
 * - generate hash from the given password
 * @param username required to populate user_name field in users table
 * @param password required to populate password_hash field in users table
 * @returns Promise resolved to an object with user fields without id
 */
const generateUserData = async (username: string, password: string): Promise<UserWithoutId> => {
  const user: UserWithoutId = {
    user_name: username,
    password_hash: await getPasswordHash(password),
    first_name: null,
    last_name: null,
    dob: null,
    gender_id: null,
    bio: null,
  };

  return Promise.resolve(user);
};

/**
 * Uses prisma client to find all users in db
 * @returns Promise resolved to array of users in json
 */
const usersInDb = async (): Promise<User[]> => {
  const users = await prismaClient.user.findMany({});
  return Promise.resolve(users);
};

/**
 * - creates user in db with given username and password
 * - converts password to password hash
 * - rest of the fields are null
 * @param username used to populate user_name field
 * @param password user to populate password_hash field
 */
const seedUser = async (username: string, password: string) => {
  const userData = await generateUserData(username, password);
  await prismaClient.user.create({
    data: userData,
  });
};

export default {
  usersInDb,
  seedUser,
};
