import {
  Request,
  CreateRequestData,
  UpdateRequestData,
  NeighborhoodWithUsers,
  FullRequestData,
} from '../types';
import prismaClient from '../../prismaClient';
import middleware from '../utils/middleware';
import neighborhoodServices from './neighborhoodServices';

/**
 * performs narrowing on object `obj`
 * returns `true` if `obj` contains required properties for
 * `CreateRequestData` type
 * @param obj - request.body
 * @returns - type predicate (boolean)
 */
const isCreateRequestData = (obj: object): obj is CreateRequestData => (
  'title' in obj
  && typeof obj.title === 'string'
  && 'content' in obj
  && typeof obj.content === 'string'
  && 'neighborhood_id' in obj
  && typeof obj.neighborhood_id === 'number'
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
      neighborhood_id: body.neighborhood_id,
    };

    return requestData;
  }

  const error = new Error('Title, content or neighborhood ID missing or invalid.');
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

/**
 * - fetches request with associated user and responses
 * - throws error if request not found
 * @param requestId
 * @returns
 */
// TODO: Add return type after refactoring merge
const getFullRequestData = async (requestId: number): Promise<FullRequestData> => {
  const request: FullRequestData = await prismaClient.request.findUniqueOrThrow({
    where: {
      id: requestId,
    },
    include: {
      user: true,
      responses: true,
      neighborhood: {
        include: {
          users: true,
        },
      },
    },
  });

  return request;
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

  if (props.some((prop) => !VALID_PROPS.includes(prop))) return false;
  if ('title' in obj && typeof obj.title !== 'string') return false;
  if ('content' in obj && typeof obj.content !== 'string') return false;
  if ('status' in obj && obj.status !== 'OPEN' && obj.status !== 'CLOSED') {
    return false;
  }

  return true;
};

/**
 * - updates a request
 * @param body - may contain title, content, and/or status
 * @param requestId - (number) must be an existing request id
 * @returns - Promise resolving to updated request
 */
const updateRequest = async (body: unknown, requestId: number): Promise<Request> => {
  if (!middleware.isObject(body)) {
    const error = new Error('unable to parse data');
    error.name = 'InvalidInputError';
    throw error;
  }

  if (!isUpdateRequestData(body)) {
    const error = new Error('Title, content and/or status value is invalid');
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
 */
const deleteRequest = async (requestId: number) => {
  await prismaClient.request.delete({
    where: { id: requestId },
  });
};

/**
 * - returns true if user is a member of request's neighborhood
 * - throws an error if requestId is invalid or request not found
 * @param userId
 * @param requestId
 * @returns Promise resolving to boolean
 */
const hasUserAccessToRequest = async (userId: number, requestId: number): Promise<boolean> => {
  const request: Request = await getRequestById(requestId);

  const neighborhoodId = request.neighborhood_id;

  const isUserMemberOfRequestsNeighborhood = await neighborhoodServices.isUserMemberOfNeighborhood(
    userId,
    neighborhoodId,
  );

  return isUserMemberOfRequestsNeighborhood;
};

/**
 * - validates data for creating new request in the db
 * - title and content length should be >= 4,
 * - user must be a member of the neighborhood represented by neighborhoodId
 * - throws Error if data is not valid
 * @param requestData parsed request data sent to POST /requests
 * @param userId should be a member of neighborhood
 * @param neighborhoodId
 */
const validateCreateRequestData = async (
  requestData: CreateRequestData,
  userId: number,
  neighborhoodId: number,
): Promise<void> => {
  const neighborhood: NeighborhoodWithUsers | null = await prismaClient.neighborhood.findUnique({
    where: {
      id: neighborhoodId,
    },
    include: {
      users: true,
    },
  });

  const MIN_LENGTH = 4;
  let errorMsg = '';

  if (!neighborhood) errorMsg = 'Neighborhood does not exist';

  if (!errorMsg && requestData.title.trim().length < MIN_LENGTH) {
    errorMsg = 'Title must be at least 4 characters long.';
  }

  if (!errorMsg && requestData.content.trim().length < MIN_LENGTH) {
    errorMsg = 'Content must be at least 4 characters long.';
  }

  if (!errorMsg && neighborhood) {
    const neighborhoodsUsersIds = neighborhood.users.map((user) => user.id);

    if (!neighborhoodsUsersIds.includes(userId)) {
      errorMsg = 'User is not a member of neighborhood';
    }
  }

  if (errorMsg) {
    const error = new Error(errorMsg);
    error.name = 'InvalidInputError';
    throw error;
  }
};

/**
 * - creates a new request in the database
 * @param requestData - should contain title, content and neighborhoodId
 * @param userId - user must be a member of the neighborhood represented by neighborhoodId
 * @returns - Promise resolving to newly created request
 */
const createRequest = async (
  requestData: CreateRequestData,
  userId: number,
): Promise<Request> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { neighborhood_id } = requestData;
  await validateCreateRequestData(requestData, userId, Number(neighborhood_id));

  const request: Request = await prismaClient.request.create({
    data: {
      neighborhood_id: Number(neighborhood_id),
      user_id: userId,
      title: requestData.title,
      content: requestData.content,
      status: 'OPEN',
    },
  });

  return request;
};

export default {
  getRequestById,
  getFullRequestData,
  hasUserCreatedRequest,
  parseCreateRequestData,
  updateRequest,
  deleteRequest,
  hasUserAccessToRequest,
  createRequest,
};
