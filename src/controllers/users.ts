import express, { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import catchError from '../utils/catchError';
import prisma from '../model/prismaClient';
import routeHelpers from '../utils/routeHelpers';

const usersRouter = express.Router();

usersRouter.get('/', catchError(async (_req: Request, res: Response) => {
  res.status(200).send('users will be fetched');
}));

usersRouter.post('/', catchError(async (req: Request, res: Response) => {
  const newUserData = await routeHelpers.generateNewUserData(req.body);

  const savedUser: User = await prisma.user.create({ data: newUserData });
  const userWithoutPasswordHash = routeHelpers.getUserWithoutPasswordHash(savedUser);

  res.status(201).json(userWithoutPasswordHash);
}));

export default usersRouter;
