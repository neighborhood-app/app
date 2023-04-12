import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserWithoutId, CreateUserData } from '../types';
import prismaClient from '../../prismaClient';

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
 * - Parses and generates user-data from input-data for users table
 * - only input and password required, rest values for a user are null
 * - generate hash from the given password and save it as password_hash
 * @param username required to populate user_name field in users table
 * @param password required to populate password_hash field in users table
 * @returns Promise resolved to an object with user fields without id
 */
const generateUserData = async (createUserData: CreateUserData): Promise<UserWithoutId> => {
  const { username, password } = createUserData;
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
 * @returns Promise resolved to an array consisting all users in db
 */
const usersInDb = async (): Promise<User[]> => {
  const users = await prismaClient.user.findMany({});
  return Promise.resolve(users);
};

/**
 * - creates user in db users table with given username and password
 * - rest of the fields are null
 * @param username used to populate user_name field
 * @param password user to populate password_hash field
 */
const seedUser = async (createUserData: CreateUserData) => {
  const userDataWithoutId = await generateUserData(createUserData);
  await prismaClient.user.create({
    data: userDataWithoutId,
  });
};

export default {
  usersInDb,
  seedUser,
};
