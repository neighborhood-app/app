import { Request } from '@prisma/client';
import { CreateRequestData, NeighborhoodWithUsers } from '../types';
import prismaClient from '../../prismaClient';

/**
 * - validates data for creating new request in the db
 * - neighborhood must exist, title length should be >= 4,
 * - and user must be a member of that neighborhood
 * - throws Error if data is not valid
 * @param requestData parsed request data sent to POST /requests
 * @param userId should be a member of neighborhood
 */
const validateCreateRequestData = async (requestData: CreateRequestData, userId: number) => {
  const neighborhood: NeighborhoodWithUsers | null = await prismaClient
    .neighborhood.findUnique({
      where: {
        id: requestData.neighborhood_id,
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
 * - parses data sent to POST /request
 * - must contain neighborhood_id, title and content
 * @param body req.body
 * @returns Promise which resolves to parsed create request data
 */
const parseCreateRequestData = async (body: unknown): Promise<CreateRequestData> => {
  if (!body || typeof body !== 'object') {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  if ('neighborhood_id' in body && typeof body.neighborhood_id === 'number'
    && 'title' in body && typeof body.title === 'string'
    && 'content' in body && typeof body.content === 'string') {
    const requestData: CreateRequestData = {
      neighborhood_id: body.neighborhood_id,
      title: body.title,
      content: body.content,
    };

    return requestData;
  }

  const error = new Error('neighborhood_id, title or content missing or invalid');
  error.name = 'InvalidInputError';
  throw error;
};

/**
 * - creates a new request in the database
 * @param requestData - should contain title, content and neighborhoodId
 * @param userId - user must be a member of the neighborhood
 * @returns - Promise resolving to newly created request
 */
const createRequest = async (requestData: CreateRequestData, userId: number): Promise<Request> => {
  await validateCreateRequestData(requestData, userId);

  const request: Request = await prismaClient.request.create({
    data: {
      neighborhood_id: requestData.neighborhood_id,
      user_id: userId,
      title: requestData.title,
      content: requestData.content,
      status: 'OPEN',
    },
  });

  return request;
};

/**
 * - fetches request from db
 * - throws error if request not found
 * @param requestId
 * @returns
 */
const getRequestById = async (requestId: number): Promise<Request> => {
  const request: Request = await prismaClient.request.findUniqueOrThrow({
    where: {
      id: requestId,
    },
  });

  return request;
};

export default {
  parseCreateRequestData,
  createRequest,
  getRequestById,
};
