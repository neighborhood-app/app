import express, { Response } from 'express';
import { User } from '@prisma/client';
import catchError from '../utils/catchError';
import { LoginData, RequestWithAuthentication } from '../types';
import loginServices from '../services/loginServices';
import middleware from '../utils/middleware';

const loginRouter = express.Router();

loginRouter.post('/', middleware.isUserLoggedIn, catchError(async (request: RequestWithAuthentication, response: Response) => {
  const userIsLoggedIn = typeof request.loggedUserId === 'number';
  if (userIsLoggedIn) return response.status(409).json({ error: 'user already logged in' });

  const loginData: LoginData = await loginServices.parseLoginData(request.body);
  const userInDb: User = await loginServices.findUserByUsername(loginData.username);

  console.log('login data from backend', loginData);

  const isPasswordCorrect = await loginServices
    .isPasswordCorrect(loginData.password, userInDb.password_hash);

  console.log({ isPasswordCorrect });

  if (!isPasswordCorrect) {
    return response.status(401).json({ error: 'invalid username or password' });
  }

  const token: string = await loginServices.generateToken(userInDb.user_name, userInDb.id);
  const responseData = {
    username: userInDb.user_name,
    token,
  };

  console.log(responseData);

  return response.status(200).json(responseData);
}));

export default loginRouter;
