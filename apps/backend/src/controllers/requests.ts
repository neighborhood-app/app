import express, { Request, Response } from 'express';
import { Request as DatabaseRequest } from '@prisma/client';
import catchError from '../utils/catchError';
import middleware from '../utils/middleware';
import { CreateRequestData, RequestWithAuthentication } from '../types';
import requestServices from '../services/requestServices';
import neighborhoodServices from '../services/neighborhoodServices';

const requestsRouter = express.Router();

requestsRouter.post('/', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const postData: CreateRequestData = await requestServices.parseCreateRequestData(req.body);
  const userId: number = Number(req.loggedUserId);

  const request: DatabaseRequest = await requestServices.createRequest(postData, userId);

  res.status(201).send(request);
}));

requestsRouter.get('/neighborhood/:id', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const neighborhoodID = Number(req.params.id);
  // LoginValidator ensures that loggedUserId is present
  const loggedUserID = req.loggedUserId as number;

  const isUserMemberOfNeighborhood: boolean = await neighborhoodServices
    .isUserMemberOfNeighborhood(loggedUserID, neighborhoodID);

  if (!isUserMemberOfNeighborhood) {
    return res.status(400).send({ error: 'user is not a member of the neighborhood' });
  }

  const requests: DatabaseRequest[] = await neighborhoodServices
    .getRequestsAssociatedWithNeighborhood(neighborhoodID);

  res.status(200).send(requests);
}));

requestsRouter.get('/:requestId/neighborhood/:neighborhoodId', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  console.log(req.headers);
  res.status(200).send('hello world');
}));

export default requestsRouter;
