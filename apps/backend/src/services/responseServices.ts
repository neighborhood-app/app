import { Response } from '@prisma/client';
import { ResponseData } from '../types';
import prismaClient from '../../prismaClient';
import middleware from '../utils/middleware';
// import neighborhoodServices from './neighborhoodServices';

/**
 * - parses data sent to POST /responses
 * - must contain content and requestId
 * @param body req.body
 * @returns Promise which resolves to parsed create response data
 */
const parseCreateResponseData = async (
  body: unknown,
): Promise<ResponseData> => {
  if (!middleware.isObject(body)) {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  if ('content' in body && typeof body.content === 'string'
    && 'request_id' in body && typeof body.request_id === 'number') {
    const responseData = {
      content: body.content,
      request_id: body.request_id,
    };

    return responseData;
  }

  const error = new Error(
    'Content property missing or invalid',
  );
  error.name = 'InvalidInputError';
  throw error;
};

/**
 * - creates a new request in the database
 * @param responseData - should contain content and request_id
 * @param userId - numeric id of user creating the response
 * @returns - Promise resolving to newly created response
 */
const createResponse = async (
  responseData: ResponseData,
  userId: number,
): Promise<Response> => {
  const response: Response = await prismaClient.response.create({
    data: {
      user_id: userId,
      request_id: responseData.request_id,
      content: responseData.content,
    },
  });

  return response;
};

export default {
  parseCreateResponseData,
  createResponse,
};
