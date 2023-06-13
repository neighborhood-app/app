import { Request } from '@prisma/client';
import { CreateRequestData } from '../types';
import prismaClient from '../../prismaClient';

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

  if ('title' in body && typeof body.title === 'string'
    && 'content' in body && typeof body.content === 'string') {
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
  if (!body || typeof body !== 'object') {
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

export default {
  getRequestById,
  parseCloseRequestData,
  hasUserCreatedRequest,
  closeRequest,
  parseCreateRequestData,
};
