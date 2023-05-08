import bcrypt from 'bcrypt';
import { Neighborhood, User } from '@prisma/client';
import prismaClient from '../../prismaClient';
import {
  UserWithoutId, UserWithoutPasswordHash, LoginData, CreateUserData, CreateNeighborhoodData,
  NeighborhoodWithRelatedFields,
} from '../types';

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
 * - performs input validation and type narrowing for input to POST /user
 * - if username, password present and of type string, then returns an object containing input data
 * - else throws Error
 * @param object request.body should contain username and password
 * @returns Promise resolved to user input to POST /user
 */
const generateCreateUserData = async (object: unknown): Promise<CreateUserData> => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('username' in object && 'password' in object
    && typeof object.username === 'string'
    && typeof object.password === 'string') {
    const createUserData = {
      username: object.username,
      password: object.password,
    };

    return Promise.resolve(createUserData);
  }

  const error = new Error('Username or Password missing');
  error.name = 'UserDataError';
  throw error;
};

/**
 * - narrows name type to string, checks if name is valid
 * - throws Error if name already exists in neighborhoods.name
 * - throws Error if name not valid
 * @param name this should be a valid username
 * @returns resolved promise with name as value
 */
const parseNeighborhoodName = async (name: unknown): Promise<string> => {
  const MINIMUM_NAME_LENGTH = 4;

  if (typeof name !== 'string' || name.length < MINIMUM_NAME_LENGTH) {
    const error = new Error('Invalid Neighborhood Name');
    error.name = 'NeighborhoodDataError';
    throw error;
  }

  const existingNeighborhood: Neighborhood | null = await prismaClient.neighborhood.findUnique({
    where: {
      name,
    },
  });

  if (existingNeighborhood) {
    const error = new Error('Neighborhood already exists');
    error.name = 'NeighborhoodDataError';
    throw error;
  }

  return Promise.resolve(name);
};

/**
 * transforms req.body to data for creating neighborhood
 * throws Error if admin_id or name field not present or invalid
 * @param object req.body, admin_id and name properties must be present
 * @returns Promise resolved to valid data for creating neighborhood
 */
const generateCreateNeighborhoodData = async (object: unknown): Promise<CreateNeighborhoodData> => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('admin_id' in object && typeof object.admin_id === 'number' && 'name' in object) {
    const neighborhoodData: CreateNeighborhoodData = {
      admin_id: object.admin_id,
      name: await parseNeighborhoodName(object.name),
    };

    return Promise.resolve(neighborhoodData);
  }

  const error = new Error('user id or neighborhood name missing');
  error.name = 'NeighborhoodDataError';
  throw error;
};

/**
 * - generates the new user data without id from input to POST /user
 * - throws Error if username or password invalid using individual field parsers
 * @param createUserData should contain all the necessary field of the required types
 * @returns Promise with status resolved to the user data withouti d
 */
const generateUserDataWithoutId = async (createUserData: CreateUserData)
: Promise<UserWithoutId> => {
  const { username, password } = createUserData;
  const userData = {
    user_name: await parseUsername(username),
    password_hash: await getPasswordHash(password),
    first_name: null,
    last_name: null,
    dob: null,
    gender_id: null,
    bio: null,
  };

  return Promise.resolve(userData);
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

/**
 * - performs input validation and type narrowing for input to POST /login
 * - if username, password present and of type string, then returns an object containing input data
 * - else throws Error
 * @param object request.body should contain username and password
 * @returns Promise resolved to user input to POST /login
 */
const generateLoginData = async (object: unknown): Promise<LoginData> => {
  if (!object || typeof object !== 'object') {
    const error = new Error('Username or Password Invalid');
    error.name = 'UserDataError';
    throw error;
  }

  if ('username' in object && 'password' in object
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

const isAdmin = async (loggedUserID: number, neighborhoodID: number): Promise<boolean> => {
  const neighborhood = await prismaClient.neighborhood.findFirstOrThrow({
    where: {
      id: neighborhoodID,
    },
  });
  return (neighborhood.admin_id === loggedUserID);
};

/**
 * makes db query, fetches and returns associated fields to neighborhood
 * adds admin, users and requests (to be implemented) fields and returns it
 * throws error if neighborhood not present
 * @param neighborhoodId
 * @returns a promise resolved to neighborhood data with associated fields
 */
const generateNeighborhoodDataWithRelatedFields = async (neighborhoodId: number):
Promise<NeighborhoodWithRelatedFields> => {
  const dataWithRelatedFields: NeighborhoodWithRelatedFields | null = await prismaClient
    .neighborhood.findFirst({
      where: {
        id: neighborhoodId,
      },
      include: {
        admin: true,
        users: true,
        // requests: true, TODO: Radu please see why we cant include requests here
      },
    });

  if (!dataWithRelatedFields) {
    const error = new Error('Neighborhood');
    error.name = 'InvalidInputError';
    throw error;
  }

  return Promise.resolve(dataWithRelatedFields);
};

/**
 * associates user to neighborhood in the database
 * throws error if neighborhood not present or user not present
 * or user already associated with the neighborhood
 * @param userId
 * @param neighborhoodId
 */
const connectUsertoNeighborhood = async (userId: number, neighborhoodId: number): Promise<void> => {
  const user: User | null = await prismaClient.user.findUnique({ where: { id: userId } });
  const neighborhood: Neighborhood | null = await prismaClient
    .neighborhood.findUnique({ where: { id: neighborhoodId } });

  if (!user || !neighborhood) {
    const error = new Error('Invalid User or Neighborhood');
    error.name = 'InvalidInputError';
    throw error;
  }

  const neighborhoodWithUsers = await generateNeighborhoodDataWithRelatedFields(neighborhoodId);
  const neighborhoodUserIds = neighborhoodWithUsers.users.map(u => u.id);
  if (neighborhoodUserIds.includes(userId)) {
    const error = new Error('User already associated with Neighborhood');
    error.name = 'InvalidInputError';
    throw error;
  }

  await prismaClient.neighborhood.update({
    where: { id: neighborhoodId },
    data: {
      users: {
        connect: { id: userId },
      },
    },
  });
};

export default {
  generateCreateUserData,
  generateUserDataWithoutId,
  getUserWithoutPasswordHash,
  generateCreateNeighborhoodData,
  generateLoginData,
  isAdmin,
  generateNeighborhoodDataWithRelatedFields,
  connectUsertoNeighborhood,
};
