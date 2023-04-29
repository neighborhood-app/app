import { Request, Response, NextFunction } from 'express';
import jsonwebtoken, { JwtPayload, Secret } from 'jsonwebtoken';
import { User } from '@prisma/client';
import logger from './logger';
import config from './config';
import prismaClient from '../../prismaClient';

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
  if (error.name === 'UserDataError') {
    response.status(400).send({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    response.status(400).json({ error: error.message });
  } else if (error instanceof SyntaxError) {
    response.status(400).send({ error: error.message });
  } else {
    logger.error(error.message);
    response.status(500).send({ error: 'Oops! An error happened' });
  }
};

/*
Extracts the authorization header from an incoming request
The authorization header is a string composed of the authorization schema (In our case 'Bearer')
and the token that was saved by the client on login.
The middleware checks if the correct authorization schema is used and saves the token to a token
property on the request.
*/
const tokenExtractor = (req: Request, _res: Response, next: NextFunction): void => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    // @ts-ignore
    req.token = authorization.replace('Bearer ', '');
  }
  next();
};

/*
Extracts the logged in user that made the request based on the request token.
*/
const userExtractor = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  if (!req.token) {
    res.status(401).json({ error: 'no token given' });
  }
  // @ts-ignore
  const decodedToken = jsonwebtoken.verify(req.token, config.SECRET as Secret) as JwtPayload;
  if (!decodedToken.id) {
    res.status(401).json({ error: 'token invalid' });
  }
  // @ts-ignore
  req.user = await prismaClient.user.findFirst({
    where: {
      id: decodedToken.id,
    },
  }) as User;

  // @ts-ignore
  console.log(req);
  next();
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
