import express, { Response } from 'express';
import catchError from '../utils/catchError';
import middleware from '../utils/middleware';
import responseServices from '../services/responseServices';
import requestServices from '../services/requestServices';
import neighborhoodServices from '../services/neighborhoodServices';
import { RequestWithAuthentication, ResponseData } from '../types';

const responsesRouter = express.Router();

// Create response
responsesRouter.post(
  '/',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const loggedUserId: number = req.loggedUserId as number;
    const postData: ResponseData = await responseServices.parseCreateResponseData(req.body);
    const request = await requestServices.getRequestById(postData.request_id);

    const isUserMemberOfNeighborhood = await neighborhoodServices.isUserMemberOfNeighborhood(
      loggedUserId,
      request.neighborhood_id,
    );

    if (!isUserMemberOfNeighborhood) {
      return res.status(401).send('User is not authorized to respond.');
    }

    const response = await responseServices.createResponse(
      postData,
      loggedUserId,
    );

    return res.status(201).send(response);
  }),
);

// Get a single response
responsesRouter.get(
  '/:id',
  middleware.userIdExtractorAndLoginValidator,
  middleware.validateURLParams,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const responseId: number = Number(req.params.id);
    const loggedUserId = req.loggedUserId as number;

    const response = await responseServices.getResponseById(responseId);
    const request = await requestServices.getRequestById(response.request_id);

    const isUserMemberOfNeighborhood = await neighborhoodServices.isUserMemberOfNeighborhood(
      loggedUserId,
      request.neighborhood_id,
    );

    if (!isUserMemberOfNeighborhood) {
      return res.status(401).send('User is not part of neighborhood.');
    }

    return res.status(200).send(response);
  }),
);

export default responsesRouter;
