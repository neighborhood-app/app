import express, { Response } from 'express';
// import { Novu } from '@novu/node';
import catchError from '../utils/catchError';
import middleware from '../utils/middleware';
import { JoinNeighborhoodArgs, RequestWithAuthentication } from '../types';
import { triggers } from '../services/notificationServices';
import neighborhoodServices from '../services/neighborhoodServices';

// MOVE KEY TO .env file
// const NOVU_API_KEY = '9cc0a07918a5743da4558428c33d6558';
// const novu = new Novu(NOVU_API_KEY);

const notificationsRouter = express.Router();

// User requested to join a neighborhood
notificationsRouter.post(
  '/join-neighborhood/:neighborhoodId',
  middleware.userIdExtractorAndLoginValidator,
  middleware.validateURLParams,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const { neighborhoodId } = req.params;
    const { loggedUserId, username } = req;

    const neighborhood = await neighborhoodServices.getNeighborhoodDetailsForMembers(+neighborhoodId);
    const adminId = String(neighborhood.admin_id);
    const neighborhoodName = neighborhood.name;
    const args: JoinNeighborhoodArgs = {
      adminId,
      userId: String(loggedUserId),
      neighborhoodId,
      neighborhoodName,
      username: username || ''
    }

    await triggers.joinNeighborhood(args);
    return res.status(201).send({ success: `Your request to join ${neighborhoodName} has been sent.` });
  }),
);

// User was accepted as neighborhood member
notificationsRouter.post(
  '/join-accepted/:neighborhoodId',
  middleware.userIdExtractorAndLoginValidator,
  middleware.validateURLParams,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const { neighborhoodId } = req.params;
    const { userId } = req.body;

    const neighborhood = await neighborhoodServices.getNeighborhoodDetailsForMembers(+neighborhoodId);
    const neighborhoodName = neighborhood.name;

    // await could perhaps be omitted here with a `catch` callback
    await triggers.joinReqAccepted(String(userId), neighborhoodId, neighborhoodName);
    return res.status(201);
  }),
);

// User created a new request in a neighborhood
notificationsRouter.post(
  '/create-request/:requestId',
  middleware.userIdExtractorAndLoginValidator,
  middleware.validateURLParams,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const { requestId } = req.params;
    const { loggedUserId } = req;
    const { neighborhoodId } = req.body;

    await triggers.createRequest(requestId, String(loggedUserId), String(neighborhoodId));
    return res.status(201);
  }),
);

// User received a response to their request
notificationsRouter.post(
  '/receive-response/:requestId',
  middleware.userIdExtractorAndLoginValidator,
  middleware.validateURLParams,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const { requestId } = req.params;
    const { loggedUserId } = req;

    await triggers.receiveResponse(requestId, String(loggedUserId));
    return res.status(201);
  }),
);

// User's response was accepted by the requester
notificationsRouter.post(
  '/response-accepted/:responseId',
  middleware.userIdExtractorAndLoginValidator,
  middleware.validateURLParams,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const { responseId } = req.params;
    const { loggedUserId } = req;
    const { requestId } = req.body;

    await triggers.responseAccepted(responseId, requestId, String(loggedUserId));
    return res.status(201);
  }),
);

export default notificationsRouter;