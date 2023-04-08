import { Request, Response, NextFunction } from 'express';
import logger from './logger';

const requestLogger = (request: Request, _response: Response, next: NextFunction): void => {
  const { method, path, body } = request;
  logger.info(`${method} ${path} ${JSON.stringify(body)}`);

  next();
};

const unknownEndpoint = (_request: Request, response: Response): void => {
  response.status(404).send({ error: 'unknown endpoint' });
};

export default {
  requestLogger,
  unknownEndpoint,
};
