import express, { Request, Response } from 'express';
import { User } from '@prisma/client';
import catchError from '../utils/catchError';
import { LoginData } from '../types';
import loginServices from '../services/loginServices';

const loginRouter = express.Router();

loginRouter.post('/', catchError(async (request: Request, response: Response) => {
  const loginData: LoginData = await loginServices.parseLoginData(request.body);

  const userInDb: User = await loginServices.findUserByUsername(loginData.username);

  const isPasswordCorrect = await loginServices
    .isPasswordCorrect(loginData.password, userInDb.password_hash);

  if (userInDb && isPasswordCorrect) {
    const token: string = await loginServices.generateToken(userInDb.user_name, userInDb.id);
    const responseData = {
      username: userInDb.user_name,
      token,
    };

    response.status(200).json(responseData);
  } else {
    response.status(401).json({ error: 'invalid username or password' });
  }
}));

export default loginRouter;
