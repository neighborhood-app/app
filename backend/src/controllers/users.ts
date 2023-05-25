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

  const user: UserWithoutPasswordHash | null = await usersServices.getUserById(userId);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: 'user not found' });
  }
}));

usersRouter.post('/', catchError(async (req: Request, res: Response) => {
  const createUserData = await usersServices.parseCreateUserData(req.body);

  const newUser: UserWithoutPasswordHash | null = await usersServices.createUser(createUserData);

  if (newUser) {
    res.status(201).json(newUser);
  } else {
    res.status(500).json({ error: 'User was not created' });
  }
}));

export default usersRouter;
