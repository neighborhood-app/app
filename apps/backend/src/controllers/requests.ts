import express, { Response } from 'express';
import { Request as RequestData } from '@prisma/client';
import catchError from '../utils/catchError';
import middleware from '../utils/middleware';
import { CreateRequestData, RequestWithAuthentication } from '../types';
import requestServices from '../services/requestServices';
import neighborhoodServices from '../services/neighborhoodServices';
import prismaClient from '../../prismaClient';

const requestsRouter = express.Router();

// Create request
requestsRouter.post('/', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const postData: CreateRequestData = await requestServices.parseCreateRequestData(req.body);
  const userId: number = Number(req.loggedUserId);

  const request: RequestData = await requestServices.createRequest(postData, userId);

  res.status(201).send(request);
}));

// Get a neighborhood's requests
requestsRouter.get('/neighborhood/:id', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const neighborhoodID = Number(req.params.id);
  // LoginValidator ensures that loggedUserId is present
  const loggedUserID = req.loggedUserId as number;

  const isUserMemberOfNeighborhood: boolean = await neighborhoodServices
    .isUserMemberOfNeighborhood(loggedUserID, neighborhoodID);

  if (!isUserMemberOfNeighborhood) {
    return res.status(400).send({ error: 'user is not a member of the neighborhood' });
  }

  // should this be in requestServices
  const requests: RequestData[] = await neighborhoodServices
    .getRequestsAssociatedWithNeighborhood(neighborhoodID);

  return res.status(200).send(requests);
}));

// Get single request from neighborhood
requestsRouter.get('/:requestId/neighborhood/:neighborhoodId', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const requestId = Number(req.params.requestId);
  const neighborhoodId = Number(req.params.neighborhoodId);
  const loggedUserId = req.loggedUserId as number;

  const isUserMemberOfNeighborhood = await neighborhoodServices
    .isUserMemberOfNeighborhood(loggedUserId, neighborhoodId);

  if (!isUserMemberOfNeighborhood) {
    return res.status(401).send({ error: 'user not a member of neighborhood' });
  }

  const isRequestAssociatedWithNeighborhood = await neighborhoodServices
    .isRequestAssociatedWithNeighborhood(requestId, neighborhoodId);

  if (!isRequestAssociatedWithNeighborhood) {
    return res.status(400).send({ error: 'request not associated with the neighborhood' });
  }

  const request: RequestData = await requestServices.getRequestById(requestId);
  return res.status(200).send(request);
}));

// Update request
requestsRouter.put(
  '/:requestId/neighborhoods/:neighborhoodId',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const data = req.body;
    const userId = Number(req.loggedUserId);
    const requestId = Number(req.params.requestId);

    const updatedRequest: RequestData = await prismaClient.request.update({
      where: { id: requestId },
      data,
    });

    res.status(200).json(updatedRequest);
  }),
);

export default requestsRouter;
