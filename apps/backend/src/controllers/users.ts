import express, { Request, Response } from 'express';
import catchError from '../utils/catchError';
import userServices from '../services/userServices';
import middleware from '../utils/middleware';
import { UserWithoutPasswordHash, RequestWithAuthentication } from '../types';

const usersRouter = express.Router();

usersRouter.get('/', catchError(async (_req: Request, res: Response) => {
  const users: Array<UserWithoutPasswordHash> = await userServices.getAllUsers();

  res.status(200).json(users);
}));

usersRouter.get('/:id', catchError(async (req: Request, res: Response) => {
  const userId: number = Number(req.params.id);

  const user: UserWithoutPasswordHash = await userServices.getUserById(userId);

  res.status(200).json(user);
}));

usersRouter.post('/', catchError(async (req: Request, res: Response) => {
  const createUserData = await userServices.parseCreateUserData(req.body);
  const newUser: UserWithoutPasswordHash = await userServices.createUser(createUserData);

  res.status(201).json(newUser);
}));

usersRouter.put(
  '/:id',
  middleware.validateURLParams,
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const userId = Number(req.loggedUserId);
    const updatedUser = await userServices.updateUser(req.body, userId);
    return res.status(200).json(updatedUser);
  }),
);

export default usersRouter;
