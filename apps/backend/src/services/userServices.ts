import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import middleware from '../utils/middleware';
import { CreateUserData, UserWithoutId, UserWithoutPasswordHash } from '../types';
import prismaClient from '../../prismaClient';

const USER_FIELDS_WITHOUT_PASSWORD_HASH = {
  id: true,
  username: true,
  email: true,
  first_name: true,
  last_name: true,
  dob: true,
  gender_id: true,
  bio: true,
};

// helpers

/**
 * - narrows username type to string, checks if username is valid
 * - throws Error if username already exists
 * - throws Error if username not valid
 * @param username this should be a valid username
 * @returns Promise resolving to username
 */
const parseAndValidateUsername = async (username: unknown): Promise<string> => {
  const MINIMUM_USERNAME_LENGTH = 4;
  if (typeof username !== 'string' || username.length < MINIMUM_USERNAME_LENGTH) {
    const error = new Error('Invalid Username');
    error.name = 'UserDataError';
    throw error;
  }

  const existingUser: User | null = await prismaClient.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    const error = new Error('User already exists');
    error.name = 'UserDataError';
    throw error;
  }

  return username;
};

/**
   * - narrows type of password to string, generates password hash from the password
   * - throws error if password is missing or invalid ie less than 4 characters
   * @param password this should be a valid password
   * @returns Promise resolving to password hash
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
  return passwordHash;
};

// user services functions

/**
 * @param obj - (object)
 * @returns - type predicate (boolean) indicating whether obj is of type `CreateUserData`
 */
const isCreateUserData = (obj: object): obj is CreateUserData => (
  'username' in obj && 'password' in obj
      && 'email' in obj
      && typeof obj.username === 'string'
      && typeof obj.password === 'string'
      && typeof obj.email === 'string'
);

/**
 * - performs type narrowing for data from req.body to POST /user
 * - if username, password present and of type string, then returns an body containing input data
 * - the mandatory fields can be changed in future
 * - else throws Error
 * @param body request.body should contain username and password
 * @returns Promise resolving to user input for POST /users
 */
const parseCreateUserData = async (body: unknown): Promise<CreateUserData> => {
  if (!middleware.isObject(body)) {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  if (isCreateUserData(body)) {
    const createUserData: CreateUserData = {
      username: body.username,
      email: body.email,
      password: body.password,
    };

    return createUserData;
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
 * currently only username and password required
 * @returns Promise resolving to the user data without id
 */
const generateUserDataWithoutId = async (createUserData: CreateUserData)
: Promise<UserWithoutId> => {
  const userData: UserWithoutId = {
    username: await parseAndValidateUsername(createUserData.username),
    password_hash: await getPasswordHash(createUserData.password),
    email: createUserData.email,
    first_name: null,
    last_name: null,
    dob: null,
    gender_id: null,
    bio: null,
  };

  return userData;
};

/**
 * fetches all users from db
 * does not include password_hash in returned user fields
 * @returns Promise resolving to Array of User Data (without password_hash)
 */
const getAllUsers = async (): Promise<Array<UserWithoutPasswordHash>> => {
  const users: Array<UserWithoutPasswordHash> = await prismaClient.user.findMany({
    select: USER_FIELDS_WITHOUT_PASSWORD_HASH,
  });

  return users;
};

/**
 * fetches user from db based on userId
 * throws an error, if userId does not correspond to a user
 * @param userId
 * @returns Promise resolving to user data without password hash.
 */
const getUserById = async (userId: number): Promise<UserWithoutPasswordHash > => {
  const user: UserWithoutPasswordHash = await prismaClient.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: USER_FIELDS_WITHOUT_PASSWORD_HASH,
  });

  return user;
};

/**
 * creates new user in db based on the userData
 * throws error if userData is invalid or new user is not created
 * @param userData must contain the required fields, currently only username and password required
 * @returns Promise resolving to created new user
 */
const createUser = async (userData: CreateUserData): Promise<UserWithoutPasswordHash> => {
  const userDataForDb: UserWithoutId = await generateUserDataWithoutId(userData);
  const newUser: User = await prismaClient.user.create({ data: userDataForDb });
  const newUsersId: number = newUser.id;
  const newUserWithoutPasswordHash: UserWithoutPasswordHash = await getUserById(newUsersId);

  return newUserWithoutPasswordHash;
};

export default {
  parseCreateUserData,
  getAllUsers,
  getUserById,
  createUser,
};
