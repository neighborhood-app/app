import express, { Request, Response, NextFunction } from 'express';
import catchError from '../utils/catchError';
import prisma from '../model/prismaClient';

const usersRouter = express.Router();

usersRouter.get('/', catchError(async (_req: Request, res: Response) => {
  res.status(200).send('users will be fetched');
}));

export default usersRouter;
