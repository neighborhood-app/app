import { Request } from '@prisma/client';
import { CreateRequestData, UpdateRequestData } from '../types';
import prismaClient from '../../prismaClient';
import middleware from '../utils/middleware';

/**
 * performs narrowing on object `obj`
 * returns `true` if `obj` contains required properties for
 * `CreateRequestData` type
 * @param obj - request.body
 * @returns - type predicate (boolean)
 */
const isCreateRequestData = (obj: object): obj is CreateRequestData => (
  'title' in obj && typeof obj.title === 'string'
  && 'content' in obj && typeof obj.content === 'string'
);

/**
 * - parses data sent to POST /requests
 * - must contain neighborhood_id, title and content
 * @param body req.body
 * @returns Promise which resolves to parsed create request data
 */
const parseCreateRequestData = async (body: unknown): Promise<CreateRequestData> => {
  if (!middleware.isObject(body)) {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  if (isCreateRequestData(body)) {
    const requestData: CreateRequestData = {
      title: body.title,
      content: body.content,
    };

    return requestData;
  }

  const error = new Error('title or content missing or invalid');
  error.name = 'InvalidInputError';
  throw error;
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

const parseCloseRequestData = async (body: unknown): Promise<number> => {
  if (!middleware.isObject(body)) {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  if ('neighborhood_id' in body
    && typeof body.neighborhood_id === 'number'
    && !Number.isNaN(body.neighborhood_id)) {
    return body.neighborhood_id;
  }

  const error = new Error('neighborhood_id missing or invalid');
  error.name = 'InvalidInputError';
  throw error;
};

/**
 * - checks whether user created the request
 * - throws error if request with requestId is not found
 * @param requestId
 * @param userId
 * @returns true if request.requestId === userId
 */
const hasUserCreatedRequest = async (requestId: number, userId: number): Promise<boolean> => {
  const request: Request = await getRequestById(requestId);

  return request.user_id === userId;
};

const closeRequest = async (requestId: number): Promise<Request> => {
  const closedRequest: Request = await prismaClient.request.update({
    where: {
      id: requestId,
    },
    data: {
      status: 'CLOSED',
    },
  });

  return closedRequest;
};

/**
 * check for each valid property that IF it exists, it has a valid data type
 * `obj` shoudn't have any other properties
 * it could be an empty object
 * @param obj - (object) the request's body
 * @returns - (boolean) type predicate for UpdateRequestData
 */
const isUpdateRequestData = (obj: object): obj is UpdateRequestData => {
  const VALID_PROPS = ['title', 'content', 'status'];
  const props = Object.keys(obj);

  if (props.some(prop => !VALID_PROPS.includes(prop))) return false;
  if ('title' in obj && typeof obj.title !== 'string') return false;
  if ('content' in obj && typeof obj.content !== 'string') return false;
  if ('status' in obj && obj.status !== 'OPEN' && obj.status !== 'CLOSED') return false;

  return true;
};

/**
 * - updates a request
 * @param requestData - should contain title, content and neighborhoodId
 * @param requestId - (number) must be an existing request id
 * @param neighborhoodId - (number) neighborhood must match the neighborhood the request exists in
 * @returns - Promise resolving to updated request
 */
const updateRequest = async (
  body: unknown,
  requestId: number,
): Promise<Request> => {
  if (!middleware.isObject(body)) {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  if (!isUpdateRequestData(body)) {
    const error = new Error('Title, content and/or status missing or invalid');
    error.name = 'InvalidInputError';
    throw error;
  }

  const updatedRequest: Request = await prismaClient.request.update({
    where: { id: requestId },
    data: { ...body },
  });

  return updatedRequest;
};

/**
 * - delete a request
 * @param requestId - (number) must be an existing request id
 * @param neighborhoodId - (number) neighborhood must match the neighborhood the request exists in
 * @returns - Promise resolving to updated request
 */
const deleteRequest = async (
  requestId: number,
  neighborhoodId: number,
) => {
  // fetch request
  // if it doesn't exist
  //  or neighborhood_id doesn't match neighborhoodId, throw error
  await prismaClient.request.findFirstOrThrow({
    where: {
      id: requestId,
      neighborhood_id: neighborhoodId,
    },
  });

  await prismaClient.request.delete({
    where: { id: requestId },
  });
};

export default {
  getRequestById,
  parseCloseRequestData,
  hasUserCreatedRequest,
  closeRequest,
  parseCreateRequestData,
  updateRequest,
  deleteRequest,
};
