import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import jsonwebtoken, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import logger from './logger';
import config from './config';
import { RequestWithAuthentication } from '../types';
import catchError from './catchError';

/**
 * - Logs method, path and body of the http request
 * - if body has property `password`, logs `'*********' inplace of plain-text password`
 * @param request Request object from express
 * @param _response Response object from express
 * @param next NextFunction object from express
 */
const requestLogger = (request: Request, _response: Response, next: NextFunction): void => {
  const { method, path } = request;
  const bodyCopy = { ...request.body }; // Dont want to mutate `request.body`

  if (bodyCopy.password !== undefined) { bodyCopy.password = '********'; }
  logger.info(`${method} ${path} ${JSON.stringify(bodyCopy)}`);

  next();
};

const unknownEndpoint = (_request: Request, response: Response): void => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error: Error, _req: Request, response: Response, _next: NextFunction)
: void => {
  logger.error(error.message);

  if (error.name === 'UserDataError') {
    response.status(400).send({ error: error.message });
  } else if (error.name === 'InvalidUserameOrPasswordError') {
    response.status(401).send({ error: error.message });
    // } else if (error.name === 'NeighborhoodDataError') {
    //   response.status(400).send({ error: error.message });
  } else if (error.name === 'InvalidInputError') {
    response.status(400).send({ error: error.message });
  } else if (error.name === 'ResourceDoesNotExistError') {
    response.status(404).send({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    response.status(400).send({ error: error.message });
  } else if (error instanceof SyntaxError) {
    response.status(400).send({ error: error.message });
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      response.status(404).send({ error: error.message });
    } else {
      response.status(400).send({ error: error.message });
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    response.status(400).send({ error: error.message });
  } else {
    response.status(400).send({ error: error.message });
  }
};

/**
 * Extracts the authorization header from an incoming request
 * The authorization header is a string composed of the authorization schema (In our case 'Bearer')
and the token that was saved by the client on user login
 * The middleware checks if the correct authorization schema is used and saves the token to a
'token' property on the request object.
 */
const tokenExtractor = (req: RequestWithAuthentication, _res: Response, next: NextFunction)
: void => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '');
  }
  next();
};

/**
 * if request has valid token, extracts userId and adds it to the request
 * else if request has invalid token ends the request with 401
 * else if request has no token, does nothing
 */
const extractUserId = async (
  req: RequestWithAuthentication,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req;

  if (token) {
    const secret: string = config.SECRET as string;
    const decodedToken = jsonwebtoken.verify(token, secret) as JwtPayload;
    if (!decodedToken.id) {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      req.loggedUserId = decodedToken.id;
    }
  }

  next();
};

/**
 * Same functionality as above but wrapped in `catchError` module
 */
const userIdExtractor = catchError(extractUserId);

/**
 * Middleware used to disallow logging in while a user is logged in.
 * if request has valid token, extracts userId and adds it to the request
 * else if the token has expired, moves on to the next middleware
 * else if request has no token, moves on to the next middleware
 * else if request has invalid token, ends the request with 401
 */
const isUserLoggedIn = catchError(async (
  req: RequestWithAuthentication,
  res: Response,
  next: NextFunction,
) => {
  try {
    return await extractUserId(req, res, next);
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) return next();

    throw error;
  }
});

/**
 * - Ensures that unauthenticated requests are ended immediately
 * - if request has valid token, extracts userId and adds it to the request
 * - else if , request has invalid token, ends the request with 401
 * - else if request has no token, ends the request with 401
 */
const userIdExtractorAndLoginValidator = catchError(async (
  req: RequestWithAuthentication,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req;

  if (token) {
    userIdExtractor(req, res, next);
  } else {
    res.status(401).send({ error: 'user not signed in' });
  }
});

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userIdExtractor,
  userIdExtractorAndLoginValidator,
  isUserLoggedIn,
};
