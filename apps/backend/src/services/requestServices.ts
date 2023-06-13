import { Request } from '@prisma/client';
import { CreateRequestData, UpdateRequestData, NeighborhoodWithUsers } from '../types';
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
 * performs narrowing on object `obj`
 * returns `true` if `obj` contains required properties for
 * `CreateRequestData` type
 * @param obj - request.body
 * @returns - type predicate (boolean)
 */
const isCreateRequestData = (obj: object): obj is CreateRequestData => (
  'neighborhood_id' in obj && typeof obj.neighborhood_id === 'number'
  && 'title' in obj && typeof obj.title === 'string'
  && 'content' in obj && typeof obj.content === 'string'
);

/**
 * - parses data sent to POST /requests
 * - must contain neighborhood_id, title and content
 * @param body req.body
 * @returns Promise which resolves to parsed create request data
 */
const parseCreateRequestData = async (body: unknown): Promise<CreateRequestData> => {
  // Extract to middleware `isObject`
  if (!body || typeof body !== 'object') {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  if (isCreateRequestData(body)) {
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
    // remove underscores from props
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

// check for each valid property that IF it exists, it has a valid data type
// the object shoudn't have any other properties
// it could be empty
const isUpdateRequestData = (obj: object): obj is UpdateRequestData => {
  const VALID_PROPS = ['title', 'content', 'status'];
  const props = Object.keys(obj);

  if (props.some(prop => !VALID_PROPS.includes(prop))) return false;
  if ('title' in obj && typeof obj.title !== 'string') return false;
  if ('content' in obj && typeof obj.content !== 'string') return false;
  if ('status' in obj && obj.status !== 'OPEN' && obj.status !== 'CLOSED') return false;

  return true;
};

const validateUpdateData = async (
  data: unknown,
  requestId: number,
  userId: number,
  neighborhoodId: number,
): Promise<UpdateRequestData> => {
  if (!data || typeof data !== 'object') {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  // fetch request
  // if it doesn't exist
  //  or user_id doesn't match userId,
  //  or neighborhood_id doesn't match neighborhoodId, throw error
  await prismaClient.request.findFirstOrThrow({
    where: {
      id: requestId,
      user_id: userId,
      neighborhood_id: neighborhoodId,
    },
  });

  // validate update data
  //  data must contain at least one of: title, content, status
  if (!isUpdateRequestData(data)) {
    const error = new Error('Title or content or status missing or invalid');
    error.name = 'InvalidInputError';
    throw error;
  }

  if ('title' in data && typeof data.title === 'string' && data.title.length < 4) {
    const error = new Error('Title or content or status missing or invalid');
    error.name = 'InvalidInputError';
    throw error;
  }

  return data;
};

/**
 * - creates a new request in the database
 * @param requestData - should contain title, content and neighborhoodId
 * @param userId - user must be a member of the neighborhood
 * @returns - Promise resolving to newly created request
 */
const updateRequest = async (
  body: unknown,
  requestId: number,
  userId: number,
  neighborhoodId: number,
): Promise<Request> => {
  if (!body || typeof body !== 'object') {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  await validateUpdateData(
    body,
    requestId,
    userId,
    neighborhoodId,
  );

  await prismaClient.request.findFirstOrThrow({
    where: {
      id: requestId,
      user_id: userId,
      neighborhood_id: neighborhoodId,
    },
  });

  // validate update data
  //  data must contain at least one of: title, content, status
  if (!isUpdateRequestData(body)) {
    const error = new Error('Title or content or status missing or invalid');
    error.name = 'InvalidInputError';
    throw error;
  }

  const updatedRequest: Request = await prismaClient.request.update({
    where: { id: requestId },
    body,
  });

  return updatedRequest;
};

export default {
  parseCreateRequestData,
  createRequest,
  getRequestById,
  updateRequest,
};
