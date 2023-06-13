import express, { Response } from 'express';
import { Request as RequestData } from '@prisma/client';
import catchError from '../utils/catchError';
import middleware from '../utils/middleware';
import { RequestWithAuthentication } from '../types';
import requestServices from '../services/requestServices';

const requestsRouter = express.Router();

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

// Update request
requestsRouter.put(
  '/:requestId/neighborhoods/:neighborhoodId',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const userId = Number(req.loggedUserId);
    // try using spread syntax
    const requestId = Number(req.params.requestId);
    const neighborhoodId = Number(req.params.neighborhoodId);

    const updatedRequest: RequestData = await requestServices.updateRequest(
      req.body,
      requestId,
      userId,
      neighborhoodId,
    );

    res.status(200).json(updatedRequest);
  }),
);

export default requestsRouter;
