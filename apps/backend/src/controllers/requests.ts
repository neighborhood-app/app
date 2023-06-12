import express, { Response } from 'express';
import { Request as RequestData } from '@prisma/client';
import catchError from '../utils/catchError';
import middleware from '../utils/middleware';
import { CreateRequestData, RequestWithAuthentication } from '../types';
import requestServices from '../services/requestServices';
import neighborhoodServices from '../services/neighborhoodServices';

const requestsRouter = express.Router();

requestsRouter.post('/', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const postData: CreateRequestData = await requestServices.parseCreateRequestData(req.body);
  const userId: number = Number(req.loggedUserId);

  const request: RequestData = await requestServices.createRequest(postData, userId);

  res.status(201).send(request);
}));

requestsRouter.put('/:id/close', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const requestId: number = Number(req.params.id);
  const loggedUserID: number = req.loggedUserId as number;

  const hasUserCreatedRequest: boolean = await requestServices
    .hasUserCreatedRequest(requestId, loggedUserID);

  if (!hasUserCreatedRequest) {
    res.status(400).send({ error: 'user has not created the request' });
  }

  const closedRequest: RequestData = await requestServices.closeRequest(requestId);
  return res.status(200).send(closedRequest);
}));

export default requestsRouter;
