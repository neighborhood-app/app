import express, { Request, Response, NextFunction } from 'express';
// import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import catchError from '../utils/catchError';
import config from '../utils/config';
// import { LoginData } from '../types';
import prismaClient from '../model/prismaClient';
import routeHelpers from '../utils/routeHelpers';

const loginRouter = express.Router();

loginRouter.post('/', catchError(async (request: Request, response: Response) => {
  const { username, password } = await routeHelpers.generateLoginData(request.body);

  const user = await prismaClient.user.findUnique({
    where: {
      user_name: username,
    },
  });
  const isPasswordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password_hash);

  if (!isPasswordCorrect) {
    response.status(401).json({ error: 'invalid username or password' });
  }

  const userDataForGeneratingToken = {
    username: user?.user_name,
    id: user?.id,
  };

  // forced to typenarrow because of jwt conditions
  if (typeof config.SECRET === 'string') {
    const token = jsonwebtoken.sign(
      userDataForGeneratingToken,
      config.SECRET,
      { expiresIn: '1h' }, // token expires in 1 hour
    );

    response.status(200).json({
      username: user?.user_name,
      token,
    });
  }
}));

export default loginRouter;
