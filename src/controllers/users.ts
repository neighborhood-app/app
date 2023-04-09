import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import catchError from '../utils/catchError';
import prisma from '../model/prismaClient';

const usersRouter = express.Router();

usersRouter.get('/', catchError(async (_req: Request, res: Response) => {
  res.status(200).send('users will be fetched');
}));

usersRouter.post('/', catchError(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const SALT_ROUNDS = 10;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const userData = {
    user_name: username,
    password_hash: passwordHash,
  };

  const savedUser = await prisma.user.create({ data: userData });
  res.status(201).json(savedUser);
}));

export default usersRouter;
