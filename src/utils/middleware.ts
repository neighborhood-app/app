import { Request, Response, NextFunction } from 'express';
import logger from './logger';

/**
 * - Logs method, path and body of the http request
 * - if body has property `password`, logs `'*********' inplace of plain-text password`
 * @param request Request object from express
 * @param _response Response object from express
 * @param next NextFunction object from express
 */
const requestLogger = (request: Request, _response: Response, next: NextFunction): void => {
  const { method, path } = request;
  const body = { ...request.body };

  if (body.password !== undefined) { body.password = '********'; }
  logger.info(`${method} ${path} ${JSON.stringify(body)}`);

  next();
};

const unknownEndpoint = (_request: Request, response: Response): void => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err: Error, _req: Request, response: Response, _next: NextFunction): void => {
  logger.error(err.message);
  response.status(500).send({ error: 'something went wrong' });
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
