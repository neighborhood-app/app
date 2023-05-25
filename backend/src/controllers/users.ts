import express, { Request, Response } from 'express';
import { User } from '@prisma/client';
import catchError from '../utils/catchError';
import prismaClient from '../../prismaClient';
import routeHelpers from '../utils/routeHelpers';
import usersServices from '../services/usersServices';

const usersRouter = express.Router();

const userFieldsToDisplay = {
  id: true,
  user_name: true,
  first_name: true,
  last_name: true,
  dob: true,
  gender_id: true,
  bio: true,
};

// move all the DB calls to services
usersRouter.get('/', catchError(async (_req: Request, res: Response) => {
  const users = await prismaClient.user.findMany({
    select: userFieldsToDisplay,
  });

  res.status(200).json(users);
}));

usersRouter.get('/:id', catchError(async (req: Request, res: Response) => {
  const userId: number = Number(req.params.id);

  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
    select: userFieldsToDisplay,
  });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: 'user not found' });
  }
}));

usersRouter.post('/', catchError(async (req: Request, res: Response) => {
  const createUserData = await usersServices.parseCreateUserData(req.body);

  const userDataWithoutId = await usersServices.generateUserDataWithoutId(createUserData);

  const savedUser: User = await prismaClient.user.create({ data: userDataWithoutId });

  console.log(savedUser);

  const userWithoutPasswordHash = routeHelpers.getUserWithoutPasswordHash(savedUser);

  res.status(201).json(userWithoutPasswordHash);
}));

export default usersRouter;
