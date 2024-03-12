import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateUserData, UpdateUserData, UpdateUserInput, UserWithoutId, UserWithoutPasswordHash } from '../types';
import prismaClient from '../../prismaClient';
import { isObject,stringIsValidDate } from '../utils/helpers';

const USER_FIELDS_WITHOUT_PASSWORD_HASH = {
  id: true,
  username: true,
  email: true,
  first_name: true,
  last_name: true,
  dob: true,
  gender_id: true,
  bio: true,
  neighborhoods: true,
  requests: {
    include: {
      user: true,
    }
  }
};

// helpers

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
 * - narrows username type to string, checks if username is valid
 * - throws Error if username already exists
 * - throws Error if username not valid
 * @param username this should be a valid username
 * @returns Promise resolving to username
 */
const parseAndValidateUsername = async (username: unknown): Promise<string> => {
//   Only contains alphanumeric characters, underscore and dot.
// Underscore and dot can't be at the end or start of a username (e.g _username / username_ / .username / username.).
// Underscore and dot can't be next to each other (e.g user_.name).
// Underscore or dot can't be used multiple times in a row (e.g user__name / user..name).
  // Number of characters must be between 4 and 15.
  const usernameRegex = /^(?=.{4,20}$)(?![.])(?!.*[.]{2})(?!.*[_]{3})[a-z0-9._]+(?<![.])$/gi;

  // const MINIMUM_USERNAME_LENGTH = 4;
  if (typeof username !== 'string' || !usernameRegex.test(username)) {
    const error = new Error('The username needs to be 4-20 characters long and can contain alphanumerics, _, or .');
    error.name = 'UserDataError';
    throw error;
  }

  const existingUser: User | null = await prismaClient.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    const error = new Error('A user with that username already exists.');
    error.name = 'UserDataError';
    throw error;
  }

  return username;
};

/**
 * - checks if email exists in db
 * - throws Error if it does
 * @param email this should be a unique email
 * @returns Promise resolving to email
 */
const validateEmail = async (email: string): Promise<string> => {
  // attempted regex validation but don't know if it's a great idea
  // might suffice to use browser's built-in validation

  const existingUser: User | null = await prismaClient.user.findUnique({
    where: { email },
  });

  if (!existingUser) return email;

  const error = new Error('This email is already linked to another account.');
  error.name = 'UserDataError';
  throw error;
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
    const error = new Error('The password needs to be at least 4 characters long.');
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
 * checks if username, password and email properties are present and of type string
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
 * - performs type narrowing for data from req.body to POST /users
 * - if data is valid, returns an object containing CreateUserData
 * - else throws Error
 * @param body request.body should contain username, email and password
 * @returns Promise resolving to user input for POST /users
 */
const parseCreateUserData = async (body: unknown): Promise<CreateUserData> => {
  if (!isObject(body)) {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  if (isCreateUserData(body)) {
    const createUserData: CreateUserData = {
      username: body.username,
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
    };

    return createUserData;
  }

  const error = new Error('Username, Email or Password missing');
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
    email: await validateEmail(createUserData.email),
    first_name: createUserData.firstName || null,
    last_name: createUserData.lastName || null,
    dob: null,
    gender_id: null,
    bio: null,
  };

  return userData;
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
 * @param userData must contain the required fields, username, password and email are required
 * @returns Promise resolving to created new user
 */
const createUser = async (userData: CreateUserData): Promise<UserWithoutPasswordHash> => {
  const userDataForDb: UserWithoutId = await generateUserDataWithoutId(userData);
  const newUser: User = await prismaClient.user.create({ data: userDataForDb });
  const newUsersId: number = newUser.id;
  const newUserWithoutPasswordHash: UserWithoutPasswordHash = await getUserById(newUsersId);

  return newUserWithoutPasswordHash;
};

const isUpdateProfileData = (obj: object): obj is UpdateUserInput => {
  const VALID_PROPS = ['first_name', 'last_name', 'email', 'dob', 'bio'];
  const props = Object.keys(obj);

  if (props.some((prop) => !VALID_PROPS.includes(prop))) return false;
  if ('first_name' in obj && typeof obj.first_name !== 'string') return false;
  if ('last_name' in obj && typeof obj.last_name !== 'string') return false;
  if ('dob' in obj && typeof obj.dob !== 'string') return false;
  if ('email' in obj && typeof obj.email !== 'string') return false;
  if ('bio' in obj && typeof obj.bio !== 'string') return false;

  return true;
};

const updateUser = async (body: unknown, userId: number): Promise<UserWithoutPasswordHash> => {
  if (!isObject(body)) {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  if (!isUpdateProfileData(body)) {
    const error = new Error('Values provided are invalid');
    error.name = 'InvalidInputError';
    throw error;
  } else if (body.dob && !stringIsValidDate(body.dob)) {
    const error = new Error('Date is not valid');
    error.name = 'InvalidDateError';
    throw error;
  }
  let updateData: UpdateUserData | UpdateUserInput;

  if (body.dob && typeof body.dob === 'string') {
    updateData = {
      ...body, dob: new Date(body.dob)
    }
  } else {
    updateData = body;
  }

  const updatedProfile: UserWithoutPasswordHash = await prismaClient.user.update({
    where: { id: userId },
    data: updateData,
    // Ensures password hash isn't being sent
    select: {
      id: true,
      username: true,
      email: true,
      first_name: true,
      last_name: true,
      dob: true,
      gender_id: true,
      bio: true,
    }
  });

  return updatedProfile;
};

export default {
  parseCreateUserData,
  getAllUsers,
  getUserById,
  createUser,
  updateUser
};
