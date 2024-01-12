import express, { Response } from 'express';
import catchError from '../utils/catchError';
import { User, LoginData, LoginResponseData, RequestWithAuthentication } from '../types';
import loginServices from '../services/loginServices';
import middleware from '../utils/middleware';
import { hashSubscriberId } from '../utils/notifications';

const loginRouter = express.Router();

loginRouter.post(
  '/',
  middleware.isUserLoggedIn,
  catchError(async (request: RequestWithAuthentication, response: Response) => {
    const userIsLoggedIn = typeof request.loggedUserId === 'number';
    if (userIsLoggedIn) return response.status(409).json({ error: 'user already logged in' });

    const loginData: LoginData = await loginServices.parseLoginData(request.body);
    const userInDb: User = await loginServices.findUserByUsername(loginData.username);

    const isPasswordCorrect = await loginServices.isPasswordCorrect(
      loginData.password,
      userInDb.password_hash,
    );

    if (!isPasswordCorrect) {
      return response.status(401).json({ error: 'invalid username or password' });
    }

    const token: string = await loginServices.generateToken(userInDb.username, userInDb.id);
    const hashedSubscriberId = hashSubscriberId(String(userInDb.id));
    const responseData: LoginResponseData = {
      id: userInDb.id,
      username: userInDb.username,
      token,
      hashedSubscriberId
    };

    return response.status(200).json(responseData);
  }),
);

export default loginRouter;
