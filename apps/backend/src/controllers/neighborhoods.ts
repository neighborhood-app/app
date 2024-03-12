import express, { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import catchError from '../utils/catchError';
import middleware from '../utils/middleware';
import {
  Neighborhood,
  Request as RequestData,
  CreateNeighborhoodData,
  NeighborhoodType,
  RequestWithAuthentication,
  NeighborhoodsPerPage,
} from '../types';
import neighborhoodServices from '../services/neighborhoodServices';
import { addSubscribersToTopic, createTopic } from '../services/notificationServices';


const neighborhoodsRouter = express.Router();

neighborhoodsRouter.get(
  '/',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: Request, res: Response, next) => {
    // Execute the next route if this was a search request
    if ('searchTerm' in req.query || 'boundary' in req.query) return next();

    let { cursor }: { cursor?: string | number } = req.query;
    cursor = cursor ? Number(cursor) : undefined;

    const neighborhoods: NeighborhoodsPerPage = await neighborhoodServices.getNeighborhoods(cursor);

    return res.status(200).send(neighborhoods);
  }),
);

neighborhoodsRouter.get(
  '/',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: Request, res: Response) => {
    const { searchTerm, boundary } = req.query;

    let neighborhoods: Neighborhood[];

    if (boundary) {
      neighborhoods = await neighborhoodServices.filterNeighborhoodsByLocation(boundary as string)
    }

    else {
      neighborhoods = await neighborhoodServices.filterNeighborhoods(
        searchTerm as string,
      );
    }
    
    res.status(200).send(neighborhoods);
  }),
);

// We don't do login validation on this route
neighborhoodsRouter.get(
  '/:id',
  middleware.userIdExtractor,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const neighborhoodID: number = Number(req.params.id);
    const { loggedUserId } = req;

    const isUserLoggedInAndMemberOfNeighborhood: boolean =
      loggedUserId === undefined
        ? false
        : await neighborhoodServices.isUserMemberOfNeighborhood(loggedUserId, neighborhoodID);

    const neighborhood: NeighborhoodType = isUserLoggedInAndMemberOfNeighborhood
      ? await neighborhoodServices.getNeighborhoodDetailsForMembers(neighborhoodID)
      : await neighborhoodServices.getNeighborhoodDetailsForNonMembers(neighborhoodID);

    return res.status(200).send(neighborhood);
  }),
);

neighborhoodsRouter.delete(
  '/:id',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const neighborhoodID = Number(req.params.id);

    // LoginValidator ensures that loggedUserId is present
    const loggedUserID = req.loggedUserId as number;

    const isUserAdminOfNeighborhood = await neighborhoodServices.isUserAdminOfNeighborhood(
      loggedUserID,
      neighborhoodID,
    );

    if (!isUserAdminOfNeighborhood) {
      return res.status(403).send({ error: 'User is not the admin of this neighborhood' });
    }

    const deletedNeighborhood = await neighborhoodServices.deleteNeighborhood(neighborhoodID);
    return res.status(200).send({ success: `Neighborhood '${deletedNeighborhood.name}' has been deleted.` });
  }),
);

neighborhoodsRouter.put(
  '/:id',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const neighborhoodID = Number(req.params.id);
    // LoginValidator ensures that loggedUserId is present
    const loggedUserID = req.loggedUserId as number;

    const isUserAdminOfNeighborhood = await neighborhoodServices.isUserAdminOfNeighborhood(
      loggedUserID,
      neighborhoodID,
    );

    if (!isUserAdminOfNeighborhood) {
      return res.status(403).send({ error: 'User is not the admin of this neighborhood' });
    }

    const data = req.body;
    if (data.location) {
      data.location = JSON.parse(data.location);
    } else {
      data.location = Prisma.JsonNull;
    }

    const updatedNeighborhood = await neighborhoodServices.editNeighborhood(neighborhoodID, data);
    return res.status(200).send({ success: `Neighborhood '${updatedNeighborhood.name}' has been updated.` });
  }),
);

// Create a neighborhood
neighborhoodsRouter.post(
  '/',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const loggedUserID = req.loggedUserId as number; // loggedUserId extracted by middleware
    req.body.admin_id = loggedUserID; // adding user_id as admin_id to request.body
    const createNeighborhoodData: CreateNeighborhoodData =
      await neighborhoodServices.parseCreateNeighborhoodData(req.body);

    const newNeighborhood: Neighborhood =
      await neighborhoodServices.createNeighborhood(createNeighborhoodData);

    const TOPIC_KEY = `neighborhood:${newNeighborhood.id}`;
    await createTopic(TOPIC_KEY, newNeighborhood.name);

    const promises = [
      neighborhoodServices.connectUserToNeighborhood(loggedUserID, newNeighborhood.id),
      addSubscribersToTopic(TOPIC_KEY, [loggedUserID]),
      neighborhoodServices.getNeighborhoodDetailsForMembers(newNeighborhood.id),
    ];

    const responses = await Promise.all(promises);
    return res.status(201).json(responses[2]);
  }),
);

// Join a neighborhood
neighborhoodsRouter.post(
  '/:id/join/:userId',
  middleware.userIdExtractorAndLoginValidator,
  middleware.validateURLParams,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    // The logged user should be the admin of the neighborhood NOT the user to join
    const loggedUserId = req.loggedUserId as number;
    const neighborhoodId = Number(req.params.id);
    const userId = Number(req.params.userId);

    const isAdminOfNeighborhood = await neighborhoodServices.isUserAdminOfNeighborhood(
      loggedUserId,
      neighborhoodId,
    );

    if (!isAdminOfNeighborhood)
      return res.status(401).send({ error: 'You are not authorized to do this.' });

    const responses = [
      neighborhoodServices.connectUserToNeighborhood(userId, neighborhoodId),
      addSubscribersToTopic(`neighborhood:${neighborhoodId}`, [userId]),
    ];

    await Promise.all(responses);

    return res.status(201).send({ success: 'Yay! Your neighborhood is growing.' });
  }),
);

// Leave a neighborhood
neighborhoodsRouter.put(
  '/:id/leave',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const loggedUserId = req.loggedUserId as number;
    const neighborhoodId = Number(req.params.id);

    if (!neighborhoodId || Number.isNaN(neighborhoodId)) {
      return res.status(400).send({ error: 'Unable to parse URL' });
    }

    await neighborhoodServices.removeUserFromNeighborhood(loggedUserId, neighborhoodId);
    return res.status(201).send({ success: 'You have left this neighborhood.' });
  }),
);

// Get a neighborhood's requests
neighborhoodsRouter.get(
  '/:id/requests',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const neighborhoodID = Number(req.params.id);
    // LoginValidator ensures that loggedUserId is present
    const loggedUserID = req.loggedUserId as number;

    const isUserMemberOfNeighborhood: boolean =
      await neighborhoodServices.isUserMemberOfNeighborhood(loggedUserID, neighborhoodID);

    if (!isUserMemberOfNeighborhood) {
      return res.status(400).send({ error: 'User is not a member of the neighborhood' });
    }

    const requests: RequestData[] =
      await neighborhoodServices.getNeighborhoodRequests(neighborhoodID);

    return res.status(200).send(requests);
  }),
);

export default neighborhoodsRouter;
