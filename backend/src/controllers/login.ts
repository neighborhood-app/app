import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import catchError from '../utils/catchError';
import config from '../utils/config';
import prismaClient from '../../prismaClient';
import routeHelpers from '../utils/routeHelpers';
import { LoginData } from '../types';
import loginServices from '../services/loginServices';

const loginRouter = express.Router();

loginRouter.post('/', catchError(async (request: Request, response: Response) => {
  const loginData: LoginData = await loginServices.generateLoginData(request.body);

  const userFromDb = await prismaClient.user.findUnique({
    where: {
      user_name: loginData.username,
    },
  });

  const isPasswordCorrect = userFromDb === null
    ? false
    : await bcrypt.compare(loginData.password, userFromDb.password_hash);

  if (!isPasswordCorrect) {
    response.status(401).json({ error: 'invalid username or password' });
    // the request still passed through the error handler
    // middleware which attempted to send a second request back to the client,
    // causing an error on the server.
  } else {
    const userDataForGeneratingToken = {
      username: userFromDb?.user_name,
      id: userFromDb?.id,
    };

    // forced to check type of string because of SECRET could be undefined
    if (typeof config.SECRET === 'string') {
      const token = jsonwebtoken.sign(
        userDataForGeneratingToken,
        config.SECRET,
        { expiresIn: '1h' }, // token expires in 1 hour
      );

      response.status(200).json({
        username: userFromDb?.user_name,
        token,
      });
    }
  }
}));

export default loginRouter;
