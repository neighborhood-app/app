import { Response } from '@prisma/client';
import { ResponseData, UpdateResponseData, ResponseWithRequest } from '../types';
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
const isResponseData = (obj: object): obj is ResponseData => 'content' in obj
  && typeof obj.content === 'string'
  && 'request_id' in obj
  && typeof obj.request_id === 'number';
// add neighborhood_id

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
      // add neighborhood_id
    };

    return responseData;
  }

  const error = new Error('Content property missing or invalid');
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
const getResponseById = async (responseId: number): Promise<ResponseWithRequest> => {
  const response = await prismaClient.response.findUniqueOrThrow({
    where: {
      id: responseId,
    },
    include: {
      request: true,
    },
  });

  return response;
};

/**
 * - checks whether user created the response
 * - throws error if response with responseId is not found
 * @param responseId - (number) id of the response
 * @param userId - (number) id of the user
 * @returns - Promise resolving to a boolean
 */
const isUserResponseCreator = async (
  responseId: number,
  userId: number,
): Promise<boolean> => {
  const response = await getResponseById(responseId);
  return response.user_id === userId;
};

/**
 * Checks if the user is the creator of the request associated with the response
 * @param responseId - (number) id of the response
 * @param userId - (number) id of the user
 * @returns - Promise resolving to a boolean
 */
const isUserRequestCreator = async (
  responseId: number,
  userId: number,
): Promise<boolean> => {
  const response = await getResponseById(responseId);
  const { request } = response;
  return request.user_id === userId;
};

/**
 * Checks the role of the user in relation to the response.
 * The roles can be 'RESPONSE OWNER' or 'REQUEST OWNER'
 * @param responseId
 * @param userId
 * @returns 'RESPONSE OWNER' | 'REQUEST OWNER' | null
 */
const checkUserStatus = async (
  responseId: number,
  userId: number,
): Promise<'RESPONSE OWNER' | 'REQUEST OWNER' | null> => {
  const response = await getResponseById(responseId);
  const { request } = response;

  if (response.user_id === userId) {
    return 'RESPONSE OWNER';
  }
  if (request.user_id === userId) {
    return 'REQUEST OWNER';
  }

  return null;
};

// obj might be empty
// if it has a content prop, it must be a string
// if it has a status prop, it must be of ResponseStatus type
const isUpdateResponseData = (obj: object): obj is UpdateResponseData => {
  const VALID_PROPS = ['content', 'status'];
  const props = Object.keys(obj);

  if (props.some((prop) => !VALID_PROPS.includes(prop))) return false;
  if ('content' in obj && typeof obj.content !== 'string') return false;
  if (
    'status' in obj
    && obj.status !== 'PENDING'
    && obj.status !== 'ACCEPTED'
  ) {
    return false;
  }

  return true;
};

/**
 * - updates a response
 * @param body - may contain content and/or status
 * @param responseId - (number) must be an existing response id
 * @returns - Promise resolving to updated response
 */
const updateResponse = async (
  body: unknown,
  responseId: number,
  userStatus: 'RESPONSE OWNER' | 'REQUEST OWNER',
): Promise<Response> => {
  if (!middleware.isObject(body)) {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  if (!isUpdateResponseData(body)) {
    const error = new Error('Content and/or status value is invalid.');
    error.name = 'InvalidInputError';
    throw error;
  }

  let updatedResponse;

  if (userStatus === 'RESPONSE OWNER') {
    updatedResponse = await prismaClient.response.update({
      where: { id: responseId },
      data: { ...body },
    });
  } else {
    updatedResponse = await prismaClient.response.update({
      where: { id: responseId },
      data: {
        status: body.status,
      },
    });
  }

  return updatedResponse;
};

/**
 * checks if logged-in user has access to delete response
 * returns true if he user has created the response
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
const deleteResponse = async (responseId: number) => {
  await prismaClient.response.delete({
    where: { id: responseId },
  });
};

export default {
  parseCreateResponseData,
  createResponse,
  getResponseById,
  updateResponse,
  isUserResponseCreator,
  hasUserDeleteRights,
  deleteResponse,
  isUserRequestCreator,
  checkUserStatus,
};
