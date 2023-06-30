import express, { Response } from 'express';
import { Request as RequestData } from '@prisma/client';
import catchError from '../utils/catchError';
import middleware from '../utils/middleware';
import { CreateRequestData, RequestWithAuthentication } from '../types';
import requestServices from '../services/requestServices';
import neighborhoodServices from '../services/neighborhoodServices';

const requestsRouter = express.Router();

// Update request
requestsRouter.put(
  '/:id',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const userId = Number(req.loggedUserId);
    const requestId = Number(req.params.id);

    const isOwnerUser = await requestServices.hasUserCreatedRequest(requestId, userId);
    if (!isOwnerUser) return res.sendStatus(401);

    const updatedRequest: RequestData = await requestServices.updateRequest(
      req.body,
      requestId,
    );

    return res.status(200).json(updatedRequest);
  }),
);

// Delete request
requestsRouter.delete(
  '/:id',
  middleware.validateURLParams,
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const loggedUserId = req.loggedUserId as number;
    const requestId = Number(req.params.id);

    const isOwnerUser = await requestServices.hasUserCreatedRequest(+requestId, loggedUserId);
    if (!isOwnerUser) {
      const request = await requestServices.getRequestById(requestId);
      const isAdminOfNeighborhood = await neighborhoodServices
        .isUserAdminOfNeighborhood(loggedUserId, request.neighborhood_id);

      if (!isAdminOfNeighborhood) return res.sendStatus(401);
    }

    await requestServices.deleteRequest(+requestId);
    return res.sendStatus(204);
  }),
);

// update request
requestsRouter.put(
  '/:id/close',
  middleware.userIdExtractorAndLoginValidator,
  middleware.validateURLParams,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const requestId: number = Number(req.params.id);
    const loggedUserID: number = req.loggedUserId as number;

    const hasUserCreatedRequest: boolean = await requestServices
      .hasUserCreatedRequest(requestId, loggedUserID);

    if (!hasUserCreatedRequest) {
      res.status(400).send({ error: 'user has not created the request' });
    }

    const closedRequest: RequestData = await requestServices.closeRequest(requestId);
    return res.status(200).send(closedRequest);
  }),
);

// get a single request
requestsRouter.get(
  '/:id',
  middleware.userIdExtractorAndLoginValidator,
  middleware.validateURLParams,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const requestId: number = Number(req.params.id);
    const loggedUserId: number = req.loggedUserId as number;

    const hasUserAccessToRequest = await requestServices
      .hasUserAccessToRequest(loggedUserId, requestId);

    if (!hasUserAccessToRequest) {
      return res.status(401).send({ error: 'user does not have access to the neighborhood' });
    }

    const requestData: RequestData = await requestServices
      .getRequestById(requestId);
    return res.status(200).send(requestData);
  }),
);

// create request
requestsRouter.post(
  '/',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const loggedUserId: number = req.loggedUserId as number;
    const postData: CreateRequestData = await requestServices.parseCreateRequestData(req.body);

    const request: RequestData = await requestServices
      .createRequest(postData, loggedUserId);

    return res.status(201).send(request);
  }),
);

// neighborhoodsRouter.post('/:neighborhoodId/requests', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
//   const postData: CreateRequestData = await requestServices.parseCreateRequestData(req.body);

//   const loggedUserId: number = req.loggedUserId as number;
//   const neighborhoodId: number = Number(req.params.neighborhoodId) as number;

//   const request: RequestData = await neighborhoodServices
//     .createRequest(postData, loggedUserId, neighborhoodId);

//   return res.status(201).send(request);
// }));

export default requestsRouter;
