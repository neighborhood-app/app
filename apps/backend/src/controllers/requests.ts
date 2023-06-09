import express, { Request, Response } from 'express';
import { Request as RequestData } from '@prisma/client';
import catchError from '../utils/catchError';
import middleware from '../utils/middleware';
import { CreateRequestData, RequestWithAuthentication } from '../types';
import requestServices from '../services/requestServices';

const requestsRouter = express.Router();

requestsRouter.post('/', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const postData: CreateRequestData = await requestServices.parseCreateRequestData(req.body);
  const userId: number = Number(req.loggedUserId);

  const request: RequestData = await requestServices.createRequest(postData, userId);

  res.status(201).send(request);
}));

export default requestsRouter;
