import express, { Request, Response } from 'express';
import { User } from '@prisma/client';
import catchError from '../utils/catchError';
import prismaClient from '../model/prismaClient';
import routeHelpers from '../utils/routeHelpers';

const usersRouter = express.Router();

usersRouter.get('/', catchError(async (_req: Request, res: Response) => {
  res.status(200).send('users will be fetched');
}));

usersRouter.post('/', catchError(async (req: Request, res: Response) => {
  const createUserData = await routeHelpers.generateCreateUserData(req.body);
  const userDataWithoutId = await routeHelpers.generateUserDataWithoutId(createUserData);

  const savedUser: User = await prismaClient.user.create({ data: userDataWithoutId });
  const userWithoutPasswordHash = routeHelpers.getUserWithoutPasswordHash(savedUser);

  res.status(201).json(userWithoutPasswordHash);
}));

export default usersRouter;
