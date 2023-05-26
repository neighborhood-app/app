import { Neighborhood } from '@prisma/client';
import prismaClient from '../../prismaClient';
import { NeighborhoodWithRelatedFields } from '../types';

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
 * @returns true if user if part of neighborhood, false otherwise
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
 * @returns neighborhood details with id, name, description and location only
 */
const getNeighborhoodDetailsForNonMembers = async (neighborhoodId: number) => {
  const FIELDS_TO_SELECT_FOR_NON_MEMBERS = {
    id: true,
    name: true,
    description: true,
    location: true,
  };

  const neighborhood = await prismaClient.neighborhood.findUniqueOrThrow({
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
const getNeighborhoodDetailsForMembers = async (neighborhoodId: number) => {
  const FIELDS_TO_INCLUDE_FOR_MEMBERS = {
    admin: true,
    users: true,
    requests: true,
  };

  const neighborhood = await prismaClient.neighborhood.findUniqueOrThrow({
    where: {
      id: neighborhoodId,
    },
    include: FIELDS_TO_INCLUDE_FOR_MEMBERS,
  });

  return neighborhood;
};

/**
 * checks if the user is admin of the neighborhood
 * @param loggedUserID
 * @param neighborhoodID
 * @returns true if user is admin, false otherwise
 */
const isUserAdminOfNeighborhood = async (loggedUserID: number, neighborhoodID: number):
Promise<boolean> => {
  const neighborhood = await prismaClient.neighborhood.findFirstOrThrow({
    where: {
      id: neighborhoodID,
    },
  });
  return (neighborhood.admin_id === loggedUserID);
};

export default {
  getAllNeighborhoods,
  isUserMemberOfNeighborhood,
  getNeighborhoodDetailsForNonMembers,
  getNeighborhoodDetailsForMembers,
  isUserAdminOfNeighborhood,
};
