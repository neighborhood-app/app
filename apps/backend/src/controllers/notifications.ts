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

    await triggers.receiveResponse(String(loggedUserId), requestId);
    return res.status(201);
  }),
);

// notificationsRouter.post(
//   '/mark-action-done',
//   middleware.userIdExtractorAndLoginValidator,
//   catchError(async (req: RequestWithAuthentication, res: Response) => {
//     const loggedUserId: number = req.loggedUserId as number;
//     const { notificationId, btnType, status } = req.body;
    
//     const resData = await markActionDone(loggedUserId, notificationId, status, btnType);

//     return res.status(201).send(resData);
//   }),
// );

export default notificationsRouter;