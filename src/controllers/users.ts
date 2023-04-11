import express, { Request, Response } from 'express';
import { User } from '@prisma/client';
import catchError from '../utils/catchError';
import prismaClient from '../model/prismaClient';
import routeHelpers from '../utils/routeHelpers';

const usersRouter = express.Router();

usersRouter.get('/', catchError(async (_req: Request, res: Response) => {
  const users: Array<User> = await prismaClient.user.findMany({});
  const usersWithoutPasswordHash = users.map(user => routeHelpers.getUserWithoutPasswordHash(user));
  res.status(200).json(usersWithoutPasswordHash);
}));

usersRouter.get('/:id', catchError(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await prismaClient.user.findUnique({
    where: {
      id,
    },
  });
  if (user) {
    const userWithoutPasswordHash = routeHelpers.getUserWithoutPasswordHash(user);
    res.status(200).json(userWithoutPasswordHash);
  } else {
    res.status(404).json({ error: 'user not found' });
  }
}));

usersRouter.post('/', catchError(async (req: Request, res: Response) => {
  const createUserData = await routeHelpers.generateCreateUserData(req.body);
  const userDataWithoutId = await routeHelpers.generateUserDataWithoutId(createUserData);

  const savedUser: User = await prismaClient.user.create({ data: userDataWithoutId });
  const userWithoutPasswordHash = routeHelpers.getUserWithoutPasswordHash(savedUser);

  res.status(201).json(userWithoutPasswordHash);
}));

export default usersRouter;
