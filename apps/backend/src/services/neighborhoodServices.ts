/* eslint-disable no-underscore-dangle */
import { Neighborhood, Request, Response, Prisma } from '@prisma/client';
import prismaClient from '../../prismaClient';
import {
  NeighborhoodWithRelatedFields,
  CreateNeighborhoodData,
  NeighborhoodDetailsForNonMembers,
  NeighborhoodDetailsForMembers,
  NeighborhoodsPerPage,
} from '../types';

// helpers

/**
 * performs input validation for create neighborhood data
 * @param data
 * @returns Promise resolving to true if data is valid
 */


const isNeighborhoodDuplicate = async (neighborhoodName: string): Promise<boolean> => {
  const existingNeighborhood: Neighborhood | null = await prismaClient.neighborhood.findUnique({
    where: {
      name: neighborhoodName,
    },
  });

  if (existingNeighborhood) {
    return true;
  } 
    return false;
};

// neighborhood services

/**
 * fetches all neighborhoods from the db
 * @returns Promise resolving to array of neighborhoods
 */
// const getAllNeighborhoods = async (): Promise<Array<Neighborhood>> => {
//   const neighborhoods: Array<Neighborhood> = await prismaClient.neighborhood.findMany({});
//   return neighborhoods;
// };

/**
 * fetches the next 16 (17 on first batch) neighborhoods after the passed-in neighborhood id
 * if the cursor/neighborhood id is undefined, it fetches the first 17 neighborhoods
 * if there aren't any more neighborhoods, returns an empty array
 * @param currCursor - the id of the last-displayed neighborhood from the previous batch or NaN
 * @returns the requested neighborhoods, the current cursor
 *  & a boolean indicating whether there is a next page
 */
const getNeighborhoods = async (currCursor?: number): Promise<NeighborhoodsPerPage> => {
  const NHOODS_PER_PAGE = 16; // might make sense to increase this number in production
  // let firstNhood: Neighborhood | null = null;

  // if (typeof currCursor !== 'number') {
  //   firstNhood = await prismaClient.neighborhood.findFirst({});
  // }

  const neighborhoods: Neighborhood[] = await prismaClient.neighborhood.findMany({
    skip: currCursor ? 1 : 0,
    take: NHOODS_PER_PAGE,
    cursor: currCursor
      ? {
          id: currCursor,
        }
      : undefined,
  });

  // if (firstNhood) neighborhoods.unshift(firstNhood);

  let newCursor: number | undefined = neighborhoods.slice(-1)[0]?.id;
  if (neighborhoods.length === 0) return { neighborhoods, newCursor, hasNextPage: false };

  const nextPageNhood = await prismaClient.neighborhood.findMany({
    skip: 1,
    take: 1, // check if there's at least one more neighborhood
    cursor: {
      id: newCursor,
    },
  });
  
  const hasNextPage = nextPageNhood.length > 0;
  if (!hasNextPage) newCursor = undefined;

  return { neighborhoods, newCursor, hasNextPage };
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
  const neighborhood: NeighborhoodWithRelatedFields | null =
    await prismaClient.neighborhood.findUnique({
      where: {
        id: neighborhoodID,
      },
      include: {
        users: true,
        requests: true,
      },
    });

  if (neighborhood) {
    const userIdsAssociatedWithNeighborhood = neighborhood.users.map((user) => user.id);
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
const getNeighborhoodDetailsForNonMembers = async (
  neighborhoodId: number,
): Promise<NeighborhoodDetailsForNonMembers> => {
  const FIELDS_TO_SELECT_FOR_NON_MEMBERS = {
    id: true,
    name: true,
    description: true,
    location: true,
  };

  const neighborhood: NeighborhoodDetailsForNonMembers =
    await prismaClient.neighborhood.findUniqueOrThrow({
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
const getNeighborhoodDetailsForMembers = async (
  neighborhoodId: number,
): Promise<NeighborhoodDetailsForMembers> => {
  const FIELDS_TO_INCLUDE_FOR_MEMBERS = {
    admin: true,
    users: true,
    requests: {
      include: {
        user: true,
        responses: {
          include: {
            user: true,
          },
        },
      },
    },
  };

  const neighborhood: NeighborhoodDetailsForMembers =
    await prismaClient.neighborhood.findUniqueOrThrow({
      where: {
        id: neighborhoodId,
      },
      include: FIELDS_TO_INCLUDE_FOR_MEMBERS,
    });

  return neighborhood;
};

/**
 * filters all neighborhoods based on argument string
 * used to filter out the Explore page displayed data by the search term
 * does not fetch data from joined tables
 * @param searchTerm
 * @returns Promise resolving to neighborhood details without admin_id
 */
const filterNeighborhoods = async (searchTerm: string): Promise<Neighborhood[]> => {
  const neighborhoods = await prismaClient.neighborhood.findMany({
    where: {
      name: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    },
  });

  return neighborhoods;
};

const filterNeighborhoodsByLocation = async (boundary: string): Promise<Neighborhood[]> => {
  const objBoundary = JSON.parse(boundary);
  const boundaryCoordinates = {
    swLat: objBoundary._southWest.lat,
    swLng: objBoundary._southWest.lng,
    neLat: objBoundary._northEast.lat,
    neLng: objBoundary._northEast.lng,
  }

  const neighborhoods = await prismaClient.neighborhood.findMany({
    where: {
        AND: [
          {
            location: { 
              not: Prisma.JsonNull,
            }
          },
          {
            location: {
              path: ['x'],
              gt: boundaryCoordinates.swLng,
              lt: boundaryCoordinates.neLng
            }
          }, 
          {
            location: {
              path: ['y'],
              gt: boundaryCoordinates.swLat,
              lt: boundaryCoordinates.neLat
            }
          }
        ]
      },
  });

  return neighborhoods;
};

const getNeighborhoodRequests = async (nhoodId: number): Promise<Request[]> => {
  const neighborhood: NeighborhoodWithRelatedFields | null =
    await prismaClient.neighborhood.findUnique({
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

/**
 * gets all the responses in a single neighborhood
 * @param neighborhoodId (number) - the id of the neighborhood to find responses in
 * @returns an array of the responses or null if no responses were found
 */
const getNeighborhoodResponses = async (neighborhoodId: number): Promise<Response[]> => {
  const neighborhoodReqs = await getNeighborhoodRequests(neighborhoodId);
  const requestsIds = neighborhoodReqs.map((req) => req.id);
  const responses: Response[] | null = await prismaClient.response.findMany({
    where: {
      request_id: { in: requestsIds },
    },
  });

  return responses;
};

/**
 * checks if the user is admin of the neighborhood
 * throws error if neighborhoodId is invalid
 * @param userId
 * @param neighborhoodId
 * @returns true if user is admin, false otherwise
 */
const isUserAdminOfNeighborhood = async (
  userId: number,
  neighborhoodId: number,
): Promise<boolean> => {
  const neighborhood: Neighborhood = await prismaClient.neighborhood.findFirstOrThrow({
    where: {
      id: neighborhoodId,
    },
  });

  return neighborhood.admin_id === userId;
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

  if (
    'admin_id' in object &&
    typeof object.admin_id === 'number' &&
    'name' in object &&
    typeof object.name === 'string' &&
    'description' in object &&
    typeof object.description === 'string' &&
    'location' in object &&
    (typeof object.location === 'string' ||  object.location === null)
  ) {
    const neighborhoodData: CreateNeighborhoodData = {
      admin_id: object.admin_id,
      name: object.name,
      description: object.description,
      location: object.location ? JSON.parse(object.location) : null
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
 * throws error if user already associated with the neighborhood
 * @param userId
 * @param neighborhoodId
 */
const connectUserToNeighborhood = async (userId: number, neighborhoodId: number): Promise<void> => {
  const userWithNeighborhood = await prismaClient.user.findUniqueOrThrow({
    where: { id: userId },
    include: { neighborhoods: true },
  });

  const usersNeighborhoodsIds: Array<number> = userWithNeighborhood.neighborhoods.map((n) => n.id);

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
 * removes user from neighborhood in the db
 * also, marks their open requests and responses in this neighborhood INACTIVE
 * throws error if userId or neighborhoodId invalid
 * throws error if user is not a member of the neighborhood
 * @param userId
 * @param neighborhoodId
 */
const removeUserFromNeighborhood = async (
  userId: number,
  neighborhoodId: number,
): Promise<void> => {
  const neighborhood = await prismaClient.neighborhood.findUniqueOrThrow({
    where: { id: neighborhoodId },
    include: { users: true, requests: true },
  });

  const userIsMemberOfNeighborhood = neighborhood.users.some((user) => user.id === userId);
  const userIsNeighborhoodAdmin = neighborhood.admin_id === userId;

  if (!userIsMemberOfNeighborhood) {
    const error = new Error('User is not a member of this neighborhood.');
    error.name = 'Unauthorized';
    throw error;
  } else if (userIsNeighborhoodAdmin) {
    // In this case, prompt the user that this action will delete the neighborhood
    // If confirmed, delete neighborhood
    await deleteNeighborhood(neighborhoodId);
    return;
  }

  const userRequestsInNeighborhood = neighborhood.requests.filter((req) => req.user_id === userId);
  const requestsIds = userRequestsInNeighborhood.map((req) => req.id);
  const responsesInNeighborhood = await getNeighborhoodResponses(neighborhoodId);
  const userResponsesInNeighborhood = responsesInNeighborhood.filter(
    (res) => res.user_id === userId,
  );
  const responsesIds = userResponsesInNeighborhood.map((res) => res.id);

  // remove user and mark associated requests as "inactive"
  await prismaClient.neighborhood.update({
    where: { id: neighborhoodId },
    data: {
      users: {
        disconnect: { id: userId },
      },
      requests: {
        updateMany: {
          where: {
            status: 'OPEN',
            id: { in: requestsIds },
          },
          data: {
            status: 'INACTIVE',
          },
        },
      },
    },
  });

  // Mark user responses as "inactive"
  await prismaClient.response.updateMany({
    where: {
      id: { in: responsesIds },
    },
    data: {
      status: 'INACTIVE',
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
const createNeighborhood = async (neighborhoodData: CreateNeighborhoodData): Promise<Neighborhood> => {
  if (await isNeighborhoodDuplicate(neighborhoodData.name)) {
    const error = new Error('There is already a neighborhood with that name. Try something else!');
    error.name = 'InvalidInputError';
    throw error;
  } else if (neighborhoodData.name.length < 4) {
    const error = new Error('Neighborhood name must have at least 4 characters');
    error.name = 'InvalidInputError';
    throw error;
  } else {
    const newNeighborhood: Neighborhood = await prismaClient.neighborhood.create({ data: {
      ...neighborhoodData, location: neighborhoodData.location ? neighborhoodData.location as Prisma.JsonObject : Prisma.JsonNull
    } });

    return newNeighborhood;
  }
};

export default {
  getNeighborhoods,
  isUserMemberOfNeighborhood,
  getNeighborhoodDetailsForNonMembers,
  getNeighborhoodDetailsForMembers,
  filterNeighborhoods,
  isUserAdminOfNeighborhood,
  deleteNeighborhood,
  parseCreateNeighborhoodData,
  createNeighborhood,
  connectUserToNeighborhood,
  removeUserFromNeighborhood,
  getNeighborhoodRequests,
  filterNeighborhoodsByLocation
};
