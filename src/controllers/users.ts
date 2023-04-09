import express, { Request, Response, NextFunction } from 'express';
import catchError from '../utils/catchError';
import prisma from '../model/prismaClient';

const usersRouter = express.Router();

usersRouter.get('/', catchError(async (_req: Request, res: Response) => {
  res.status(200).send('users will be fetched');
}));

usersRouter.post('/', catchError(async (_req: Request, res: Response) => {
  res.status(201).send('new user will be created');
}));

export default usersRouter;
