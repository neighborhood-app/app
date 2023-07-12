import express, { Request, Response } from 'express';
import { Neighborhood, Request as RequestData } from '@prisma/client';
import catchError from '../utils/catchError';
import prismaClient from '../../prismaClient';
import middleware from '../utils/middleware';
import {
  CreateNeighborhoodData,
  NeighborhoodDetailsForMembers,
  NeighborhoodDetailsForNonMembers,
  NeighborhoodWithRelatedFields, RequestWithAuthentication,
} from '../types';
import neighborhoodServices from '../services/neighborhoodServices';

const neighborhoodsRouter = express.Router();

neighborhoodsRouter.get('/', catchError(async (_req: Request, res: Response) => {
  const neighborhoods = await neighborhoodServices.getAllNeighborhoods();
  res.status(200).send(neighborhoods);
}));

neighborhoodsRouter.get('/:id', middleware.userIdExtractor, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const neighborhoodID: number = Number(req.params.id);
  const { loggedUserId } = req;

  const isUserLoggedInAndMemberOfNeighborhood: boolean = (loggedUserId === undefined)
    ? false
    : await neighborhoodServices.isUserMemberOfNeighborhood(loggedUserId, neighborhoodID);

  const neighborhood: NeighborhoodDetailsForMembers |
  NeighborhoodDetailsForNonMembers = isUserLoggedInAndMemberOfNeighborhood
    ? await neighborhoodServices.getNeighborhoodDetailsForMembers(neighborhoodID)
    : await neighborhoodServices.getNeighborhoodDetailsForNonMembers(neighborhoodID);
  res.status(200).send(neighborhood);
}));

neighborhoodsRouter.delete('/:id', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const neighborhoodID = Number(req.params.id);

  // LoginValidator ensures that loggedUserId is present
  const loggedUserID = req.loggedUserId as number;

  const isUserAdminOfNeighborhood = await neighborhoodServices
    .isUserAdminOfNeighborhood(loggedUserID, neighborhoodID);

  if (!isUserAdminOfNeighborhood) {
    return res.status(403).send({ error: 'User is not the admin of this neighborhood' });
  }

  const deletedNeighborhood = await neighborhoodServices.deleteNeighborhood(neighborhoodID);
  return res.status(200).send(`Neighborhood '${deletedNeighborhood.name}' has been deleted.`);
}));

// Since update routes are not critical, not spending too much time on it
neighborhoodsRouter.put('/:id', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const neighborhoodID = Number(req.params.id);

  // LoginValidator ensures that loggedUserId is present
  const loggedUserID = req.loggedUserId as number;

  const isUserAdminOfNeighborhood = await neighborhoodServices
    .isUserAdminOfNeighborhood(loggedUserID, neighborhoodID);

  if (!isUserAdminOfNeighborhood) {
    return res.status(403).send({ error: 'User is not the admin of this neighborhood' });
  }

  const data = req.body;
  const updatedNeighborhood: Neighborhood = await prismaClient.neighborhood.update({
    where: { id: +req.params.id },
    data,
  });
  return res.status(200).send(`Neighborhood '${updatedNeighborhood.name}' has been updated.`);
}));

neighborhoodsRouter.post('/', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const loggedUserID = req.loggedUserId as number; // loggedUserId extracted by middleware
  req.body.admin_id = loggedUserID; // adding user_id as admin_id to request.body

  const createNeighborhoodData: CreateNeighborhoodData = await neighborhoodServices
    .parseCreateNeighborhoodData(req.body);

  const newNeighborhood: Neighborhood = await neighborhoodServices
    .createNeighborhood(createNeighborhoodData);

  await neighborhoodServices.connectUserToNeighborhood(loggedUserID, newNeighborhood.id);

  const newNeighborhoodWithRelatedFields: NeighborhoodWithRelatedFields = await neighborhoodServices
    .getNeighborhoodDetailsForMembers(newNeighborhood.id);

  res.status(201).json(newNeighborhoodWithRelatedFields);
}));

neighborhoodsRouter.post('/:id/join', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const loggedUserId = req.loggedUserId as number; // user should be extracted by the middleware
  const neighborhoodId = Number(req.params.id);

  // Just checking for presence and type of param id,
  // rest validation will be done by neighborhoodServices
  if (!neighborhoodId || Number.isNaN(neighborhoodId)) {
    return res.status(400).send({ error: 'Unable to parse URL' });
  }

  await neighborhoodServices.connectUserToNeighborhood(loggedUserId, neighborhoodId);
  return res.status(201).send({ success: 'You have joined the neighborhood' });
}));

// Get a neighborhood's requests
neighborhoodsRouter.get('/:id/requests', middleware.userIdExtractorAndLoginValidator, catchError(async (req: RequestWithAuthentication, res: Response) => {
  const neighborhoodID = Number(req.params.id);
  // LoginValidator ensures that loggedUserId is present
  const loggedUserID = req.loggedUserId as number;

  const isUserMemberOfNeighborhood: boolean = await neighborhoodServices
    .isUserMemberOfNeighborhood(loggedUserID, neighborhoodID);

  if (!isUserMemberOfNeighborhood) {
    return res.status(400).send({ error: 'user is not a member of the neighborhood' });
  }

  const requests: RequestData[] = await neighborhoodServices
    .getRequestsAssociatedWithNeighborhood(neighborhoodID);

  return res.status(200).send(requests);
}));

export default neighborhoodsRouter;
