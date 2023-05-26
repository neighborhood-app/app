import express, { Request, Response } from 'express';
import catchError from '../utils/catchError';
import usersServices from '../services/usersServices';
import { UserWithoutPasswordHash } from '../types';

const usersRouter = express.Router();

usersRouter.get('/', catchError(async (_req: Request, res: Response) => {
  const users: Array<UserWithoutPasswordHash> = await usersServices.getAllUsers();

  res.status(200).json(users);
}));

usersRouter.get('/:id', catchError(async (req: Request, res: Response) => {
  const userId: number = Number(req.params.id);

  const user: UserWithoutPasswordHash = await usersServices.getUserById(userId);

  res.status(200).json(user);
}));

usersRouter.post('/', catchError(async (req: Request, res: Response) => {
  const createUserData = await usersServices.parseCreateUserData(req.body);

  const newUser: UserWithoutPasswordHash = await usersServices.createUser(createUserData);

  res.status(201).json(newUser);
}));

export default usersRouter;
