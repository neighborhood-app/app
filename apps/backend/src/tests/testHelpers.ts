import bcrypt from 'bcrypt';
import {
  Neighborhood,
  User,
  Request,
  Response,
  UserWithoutId,
  CreateUserData,
  UserWithRequests,
} from '../types';
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
 * - username, email and password are required
 * - firstName and lastName are optional, rest of the values are null
 * - generate hash from the given password and save it as password_hash
 * @param username required to populate username field in users table
 * @param password required to populate password_hash field in users table
 * @returns Promise resolved to an object with user fields without id
 */
const generateUserData = async (createUserData: CreateUserData): Promise<UserWithoutId> => {
  const { username, password, email, firstName, lastName } = createUserData;
  const user: UserWithoutId = {
    username,
    password_hash: await getPasswordHash(password),
    email,
    first_name: firstName || null,
    last_name: lastName || null,
    dob: null,
    gender_id: null,
    bio: null,
  };

  return Promise.resolve(user);
};

/**
 * fetches neighborhood from db
 * @param neighborhoodId - (number) id of the neighborhood
 * @returns - Promise resolving to the found neighborhood or `null`
 */
const getNeighborhoodById = async (neighborhoodId: number): Promise<Neighborhood | null> => {
  const neighborhod = await prismaClient.neighborhood.findUnique({
    where: { id: neighborhoodId },
  });

  return neighborhod;
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
 * Uses prisma client to find all neighborhoods in the db
 * @returns Promise resolving to an array consisting all users in db
 */
const neighborhoodsInDb = async (): Promise<Neighborhood[]> => {
  const neighborhoods = await prismaClient.neighborhood.findMany({});
  return neighborhoods;
};

/**
 * - creates user in db users table with given username and password
 * - rest of the fields are null
 * @param username used to populate username field
 * @param password user to populate password_hash field
 */
const seedUser = async (createUserData: CreateUserData) => {
  const userDataWithoutId = await generateUserData(createUserData);
  await prismaClient.user.create({
    data: userDataWithoutId,
  });
};

const getNeighborhoodUsers = async (neighborhoodId: number): Promise<void | User[]> => {
  const neighborhood = await prismaClient.neighborhood.findFirst({
    where: {
      id: neighborhoodId,
    },
    select: {
      users: true,
    },
  });

  if (!neighborhood) {
    throw new Error('neighborhood does not exist');
  } else {
    const { users } = neighborhood;
    return users;
  }
};

/**
 * @returns number of requests present in the db
 */
const getNumberOfRequests = async (): Promise<number> => {
  const requests = await prismaClient.request.findMany({});
  return requests.length;
};

/**
 * @param userId
 * @returns a Promise resolving to Requests associated with User
 */
const getRequestsOfUser = async (userId: number): Promise<Request[]> => {
  const user: UserWithRequests = (await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      requests: true,
    },
  })) as UserWithRequests;

  return user.requests;
};

/**
 * @param neighborhoodId
 * @returns Returns a Promise resolving to Requests associated with a neighborhood
 */
const getNeighborhoodRequests = async (neighborhoodId: number): Promise<Request[]> => {
  const neighborhood = await prismaClient.neighborhood.findUnique({
    where: {
      id: neighborhoodId,
    },
    include: {
      requests: true,
    },
  });

  const requests = neighborhood?.requests || [];
  return requests;
};

/**
 * - fetches request from the db
 * - throws Error if request not found
 * @param id request_id
 * @returns
 */
const getSingleRequest = async (id: number): Promise<Request> => {
  const request = await prismaClient.request.findFirstOrThrow({
    where: {
      id,
    },
  });

  return request;
};

/**
 * - fetches all responses from the db
 * @returns an array of the responses
 */
const getResponses = async (): Promise<Response[]> => {
  const response = await prismaClient.response.findMany({});
  return response;
};

/**
 * - fetches response from the db
 * - throws Error if response not found
 * @param id response_id
 * @returns
 */
const getSingleResponse = async (id: number): Promise<Response> => {
  const response = await prismaClient.response.findFirstOrThrow({
    where: {
      id,
    },
  });

  return response;
};

/**
 * @returns number of requests present in the db
 */
const getNumberOfResponses = async (): Promise<number> => {
  const responses = await prismaClient.response.findMany({});
  return responses.length;
};

/*
 * @param userID
 * @returns a Promise resolving to Requests associated with User
 */
const getUserResponses = async (userId: number): Promise<Response[] | null> => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    include: { responses: true },
  });

  return user ? user.responses : null;
};

/**
 * - Creates a new response
 * - assumes that requestId and userId are consistent, throws error otherwise
 * @param requestId
 * @param userId
 * @param content
 * @returns the newly created response
 */
const createResponse = async (
  requestId: number,
  userId: number,
  content: string,
): Promise<Response> => {
  const response: Response = await prismaClient.response.create({
    data: {
      user_id: userId,
      request_id: requestId,
      content,
    },
  });

  return response;
};

const removeAllData = async () => {
  await prismaClient.response.deleteMany({});
  await prismaClient.request.deleteMany({});
  await prismaClient.neighborhood.deleteMany({});
  await prismaClient.user.deleteMany({});
  await prismaClient.gender.deleteMany({});

  await prismaClient.$executeRaw`ALTER SEQUENCE genders_id_seq RESTART WITH 1`;
  await prismaClient.$executeRaw`ALTER SEQUENCE users_id_seq RESTART WITH 1`;
  await prismaClient.$executeRaw`ALTER SEQUENCE responses_id_seq RESTART WITH 1`;
  await prismaClient.$executeRaw`ALTER SEQUENCE requests_id_seq RESTART WITH 1`;
  await prismaClient.$executeRaw`ALTER SEQUENCE neighborhoods_id_seq RESTART WITH 1`;
};

export default {
  getNeighborhoodById,
  usersInDb,
  neighborhoodsInDb,
  seedUser,
  getPasswordHash,
  removeAllData,
  getNeighborhoodUsers,
  getNumberOfRequests,
  getRequestsOfUser,
  getNeighborhoodRequests,
  getSingleRequest,
  getResponses,
  getSingleResponse,
  getNumberOfResponses,
  getUserResponses,
  createResponse,
};
