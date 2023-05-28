import { Neighborhood, User } from '@prisma/client';
import prismaClient from '../../prismaClient';
import {
  NeighborhoodWithRelatedFields, CreateNeighborhoodData,
  NeighborhoodDetailsForNonMembers, NeighborhoodDetailsForMembers,
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
  } // else
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
const isUserMemberOfNeighborhood = async (loggedUserID: number, neighborhoodID: number)
:Promise<boolean> => {
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
 * @returns Promise resolved to valid data for creating neighborhood
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

    return Promise.resolve(neighborhoodData);
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
  const user: User = await prismaClient.user.findUniqueOrThrow({ where: { id: userId } });
  const neighborhoodWithUsers: NeighborhoodWithRelatedFields = await prismaClient
    .neighborhood.findUniqueOrThrow({
      where: {
        id: neighborhoodId,
      },
      include: {
        admin: true,
        users: true,
        requests: true,
      },
    });

  const neighborhoodUsersIds = neighborhoodWithUsers.users.map(u => u.id);

  if (neighborhoodUsersIds.includes(user.id)) {
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
};
