import { Neighborhood, Request } from '@prisma/client';
import prismaClient from '../../prismaClient';
import {
  NeighborhoodWithRelatedFields, CreateNeighborhoodData,
  NeighborhoodDetailsForNonMembers, NeighborhoodDetailsForMembers, CreateRequestData2,
  NeighborhoodWithUsers,
} from '../types';

// helpers

/**
 * performs input validation for create neighborhood data
 * @param data
 * @returns Promise resolving to true if data is valid
 */
const isCreateNeighborhoodDataValid = async (data: CreateNeighborhoodData): Promise<boolean> => {
  const MINIMUM_NAME_LENGTH = 4;
  const neighborhoodName = data.name;

  // we do not want to throw an error if neighborhood does not exist
  // hence not using findUniqueOrThrow
  const existingNeighborhood: Neighborhood | null = await prismaClient.neighborhood.findUnique({
    where: {
      name: neighborhoodName,
    },
  });

  if (neighborhoodName.length < MINIMUM_NAME_LENGTH || existingNeighborhood) {
    return false;
  }

  return true;
};

// neighborhood services

/**
 * fetches all neighborhoods from the db
 * @returns Promise resolving to array of neighborhoods
 */
const getAllNeighborhoods = async (): Promise<Array<Neighborhood>> => {
  const neighborhoods: Array<Neighborhood> = await prismaClient.neighborhood.findMany({});
  return neighborhoods;
};

/**
 * checks if the user is part of neighborhood
 * user and neighborhood are found by their respective ids
 * throws error if neighborhood id is invalid
 * @param loggedUserID
 * @param neighborhoodID
 * @returns Promise resolving to true if user if part of neighborhood, false otherwise
 */
const isUserMemberOfNeighborhood = async (
  loggedUserID: number,
  neighborhoodID: number,
): Promise<boolean> => {
  const neighborhood: NeighborhoodWithRelatedFields | null = await prismaClient
    .neighborhood.findUnique({
      where: {
        id: neighborhoodID,
      },
      include: {
        users: true,
        requests: true,
      },
    });

  if (neighborhood) {
    const userIdsAssociatedWithNeighborhood = neighborhood.users.map(user => user.id);
    return userIdsAssociatedWithNeighborhood.includes(loggedUserID);
  }

  const error = new Error('No Neighborhood found');
  error.name = 'ResourceDoesNotExistError';
  throw error;
};

/**
 * fetches neighborhood details for non-members from db
 * does not fetch data from joined tables
 * throws error if unable to find neighborhood
 * @param neighborhoodId
 * @returns Promise resolving to neighborhood details without admin_id
 */
const getNeighborhoodDetailsForNonMembers = async (neighborhoodId: number)
  : Promise<NeighborhoodDetailsForNonMembers> => {
  const FIELDS_TO_SELECT_FOR_NON_MEMBERS = {
    id: true,
    name: true,
    description: true,
    location: true,
  };

  const neighborhood: NeighborhoodDetailsForNonMembers = await prismaClient
    .neighborhood.findUniqueOrThrow({
      where: {
        id: neighborhoodId,
      },
      select: FIELDS_TO_SELECT_FOR_NON_MEMBERS,
    });

  return neighborhood;
};

/**
 * fetched neighborhood details for non-members from db
 * does fetch data from joined tables
 * @param neighborhoodId
 * @returns neighborhood details with admin, users and requests
 */
const getNeighborhoodDetailsForMembers = async (neighborhoodId: number)
  : Promise<NeighborhoodDetailsForMembers> => {
  const FIELDS_TO_INCLUDE_FOR_MEMBERS = {
    admin: true,
    users: true,
    requests: true,
  };

  const neighborhood: NeighborhoodDetailsForMembers = await prismaClient
    .neighborhood.findUniqueOrThrow({
      where: {
        id: neighborhoodId,
      },
      include: FIELDS_TO_INCLUDE_FOR_MEMBERS,
    });

  return neighborhood;
};

/**
 * checks if the user is admin of the neighborhood
 * throws error if neighborhoodId is invalid
 * @param userID
 * @param neighborhoodID
 * @returns true if user is admin, false otherwise
 */
const isUserAdminOfNeighborhood = async (userID: number, neighborhoodID: number):
  Promise<boolean> => {
  const neighborhood: Neighborhood = await prismaClient.neighborhood.findFirstOrThrow({
    where: {
      id: neighborhoodID,
    },
  });
  return (neighborhood.admin_id === userID);
};

const deleteNeighborhood = async (neighborhoodId: number) => {
  const deletedNeighborhood: Neighborhood = await prismaClient.neighborhood.delete({
    where: { id: neighborhoodId },
  });

  return deletedNeighborhood;
};

/**
 * transforms req.body to data for creating neighborhood for POST /neighborhood
 * throws Error if admin_id or name field not present or of wrong type
 * @param object req.body, admin_id and name properties must be present
 * @returns Promise resolving to valid data for creating neighborhood
 */
const parseCreateNeighborhoodData = async (object: unknown): Promise<CreateNeighborhoodData> => {
  if (!object || typeof object !== 'object') {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  if ('admin_id' in object && typeof object.admin_id === 'number'
    && 'name' in object && typeof object.name === 'string') {
    const neighborhoodData: CreateNeighborhoodData = {
      admin_id: object.admin_id,
      name: object.name,
    };

    return neighborhoodData;
  }

  const error = new Error('user id or neighborhood name missing');
  error.name = 'InvalidInputError';
  throw error;
};

/**
 * associates user with the neighborhood in the db
 * throws error if userId or neighborhoodId invalid
 * throws error if user already associates with the neighborhood
 * @param userId
 * @param neighborhoodId
 */
const connectUserToNeighborhood = async (userId: number, neighborhoodId: number): Promise<void> => {
  const userWithNeighborhood = await prismaClient.user
    .findUniqueOrThrow({ where: { id: userId }, include: { neighborhoods: true } });

  const usersNeighborhoodsIds: Array<number> = userWithNeighborhood.neighborhoods.map(n => n.id);

  if (usersNeighborhoodsIds.includes(neighborhoodId)) {
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

/**
 * creates new neighborhood in the database
 * associates the user (from data) as the admin of the new neighborhood
 * throws error if data is invalid
 * @param data must include name, and adminId
 * @returns newly created neighborhod
 */
const createNeighborhood = async (data: CreateNeighborhoodData): Promise<Neighborhood> => {
  const createNeighborhoodDataValid = await isCreateNeighborhoodDataValid(data);

  if (!createNeighborhoodDataValid) {
    const error = new Error('Invalid data for creating neighborhood');
    error.name = 'InvalidInputError';
    throw error;
  } else {
    const newNeighborhood: Neighborhood = await prismaClient
      .neighborhood
      .create({ data });

    return newNeighborhood;
  }
};

const getRequestsAssociatedWithNeighborhood = async (nhoodId: number): Promise<Request[]> => {
  const neighborhood: NeighborhoodWithRelatedFields | null = await prismaClient
    .neighborhood.findUnique({
      where: {
        id: nhoodId,
      },
      include: {
        requests: true,
        users: true,
      },
    });

  if (!neighborhood) {
    const error = new Error('Neighborhood does not exist');
    error.name = 'InvalidInputError';
    throw error;
  }
  const { requests } = neighborhood;
  return requests;
};

const isRequestAssociatedWithNeighborhood = async (reqId: number, nhoodId: number)
  : Promise<boolean> => {
  const associatedRequests = await getRequestsAssociatedWithNeighborhood(nhoodId);
  const associatedRequestIds = associatedRequests.map(req => req.id);

  return associatedRequestIds.includes(reqId);
};

/**
 * - validates data for creating new request in the db
 * - title length should be >= 4,
 * - and user must be a member of that neighborhood
 * - throws Error if data is not valid
 * @param requestData parsed request data sent to POST /requests
 * @param userId should be a member of neighborhood
 * @param neighborhoodId
 */
const validateCreateRequestData = async (
  requestData: CreateRequestData2,
  userId: number,
  neighborhoodId: number,
): Promise<void> => {
  const neighborhood: NeighborhoodWithUsers | null = await prismaClient
    .neighborhood.findUnique({
      where: {
        id: neighborhoodId,
      },
      include: {
        users: true,
      },
    });

  const MINIMUM_TITLE_LENGTH = 4;

  if (!neighborhood) {
    const error = new Error('Neighborhood does not exist');
    error.name = 'InvalidInputError';
    throw error;
  }

  if (requestData.title.trim().length < MINIMUM_TITLE_LENGTH) {
    const error = new Error('Invalid title');
    error.name = 'InvalidInputError';
    throw error;
  }

  const neighborhoodsUsersIds = neighborhood.users.map(u => u.id);

  if (!neighborhoodsUsersIds.includes(userId)) {
    const error = new Error('User is not a member of neighborhood');
    error.name = 'InvalidInputError';
    throw error;
  }
};

/**
 * - creates a new request in the database
 * @param requestData - should contain title and content
 * @param userId - user must be a member of the neighborhood
 * @param neighborhoodId - user must be a member of this neighborhood
 * @returns - Promise resolving to newly created request
 */
const createRequest = async (
  requestData: CreateRequestData2,
  userId: number,
  neighborhoodId: number,
): Promise<Request> => {
  await validateCreateRequestData(requestData, userId, neighborhoodId);

  const request: Request = await prismaClient.request.create({
    data: {
      neighborhood_id: neighborhoodId,
      user_id: userId,
      title: requestData.title,
      content: requestData.content,
      status: 'OPEN',
    },
  });

  return request;
};

export default {
  getAllNeighborhoods,
  isUserMemberOfNeighborhood,
  getNeighborhoodDetailsForNonMembers,
  getNeighborhoodDetailsForMembers,
  isUserAdminOfNeighborhood,
  deleteNeighborhood,
  parseCreateNeighborhoodData,
  createNeighborhood,
  connectUserToNeighborhood,
  getRequestsAssociatedWithNeighborhood,
  isRequestAssociatedWithNeighborhood,
  createRequest,
};
