import express, { Request, Response, NextFunction } from 'express';
// import { User } from '@prisma/client';
import catchError from '../utils/catchError';
// import prisma from '../model/prismaClient';
// import routeHelpers from '../utils/routeHelpers';

const loginRouter = express.Router();

loginRouter.post('/', catchError(async (_req: Request, response: Response) => {
  response.status(200).send('login user route working');
}));

export default loginRouter;
