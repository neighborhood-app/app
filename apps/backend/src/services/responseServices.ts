import { Response } from '@prisma/client';
import { ResponseData } from '../types';
import prismaClient from '../../prismaClient';
import middleware from '../utils/middleware';
import requestServices from './requestServices';
import neighborhoodServices from './neighborhoodServices';

/**
 * performs narrowing on object `obj`
 * returns `true` if `obj` contains required properties for
 * `ResponseData` type
 * @param obj - request.body
 * @returns - type predicate (boolean)
 */
const isResponseData = (obj: object): obj is ResponseData => (
  'content' in obj && typeof obj.content === 'string'
    && 'request_id' in obj && typeof obj.request_id === 'number'
);

/**
 * parses data sent to POST /responses
 * must contain content and requestId
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

  if (isResponseData(body)) {
    const responseData: ResponseData = {
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
 * creates a new request in the database
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

/**
 * fetches response from db
 * throws error if response is not found
 * @param responseId - (number) id of the response
 * @returns - Promise resolving to the found response
 */
const getResponseById = async (responseId: number): Promise<Response> => {
  const response = await prismaClient.response.findUniqueOrThrow({
    where: {
      id: responseId,
    },
  });

  return response;
};

/**
 * checks if logged-in user has access to delete response
 * returns true if he user has created the response
 * or has created the associated request
 * or is admin of the associated neighborhood
 * @param responseId - (number) id of the response
 * @param userId - (number) id of the user
 * @returns - Promise resolving to boolean
 */
const hasUserDeleteRights = async (
  responseId: number,
  userId: number,
): Promise<boolean> => {
  const response = await getResponseById(responseId);
  if (response.user_id === userId) return true;

  const request = await requestServices.getRequestById(response.request_id);
  if (request.user_id === userId) return true;

  const isAdmin = await neighborhoodServices.isUserAdminOfNeighborhood(
    userId,
    request.neighborhood_id,
  );

  return isAdmin;
};

/**
 * delete a response
 * @param responseId - (number) must be an existing response id
 */
const deleteResponse = async (
  responseId: number,
) => {
  await prismaClient.response.delete({
    where: { id: responseId },
  });
};

export default {
  parseCreateResponseData,
  createResponse,
  getResponseById,
  hasUserDeleteRights,
  deleteResponse,
};
