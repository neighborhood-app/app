import express, { Request, Response } from 'express';
import { Neighborhood } from '@prisma/client';
import catchError from '../utils/catchError';
import prismaClient from '../../prismaClient';
import middleware from '../utils/middleware';
import routeHelpers from '../utils/routeHelpers';
import { CustomRequest } from '../types';

const neighborhoodsRouter = express.Router();

neighborhoodsRouter.get('/', catchError(async (_req: Request, res: Response) => {
  const neighborhoods = await prismaClient.neighborhood.findMany({});
  if (neighborhoods.length === 0) {
    res.status(404).end();
  } else {
    res.send(neighborhoods);
  }
}));

neighborhoodsRouter.get('/:id', middleware.getUserFromRequest, catchError(async (req: CustomRequest, res: Response) => {
  const options: { where: { id: number }, include?: object, select?: object } = {
    where: { id: +req.params.id },
  };

  if (req.user && await routeHelpers.isMember(req.user.id, Number(req.params.id))) {
    options.include = {
      admin: true,
      users: true,
      requests: true,
    };
  } else {
    options.select = {
      id: true,
      name: true,
      description: true,
      location: true,
    };
  }

  const neighborhood: Neighborhood = await prismaClient.neighborhood.findUniqueOrThrow(options);
  res.send(neighborhood);
}));

neighborhoodsRouter.delete('/:id', middleware.userExtractor, catchError(async (req: CustomRequest, res: Response) => {
  if (await routeHelpers.isLoggedInAdmin(req)) {
    const deletedNeighborhood = await prismaClient.neighborhood.delete({
      where: { id: +req.params.id },
    });
    res.status(200).send(`Neighborhood '${deletedNeighborhood.name}' has been deleted.`);
  } else {
    res.status(403).send({ error: 'User is not the admin of this neighborhood' });
  }
}));

neighborhoodsRouter.put('/:id', middleware.userExtractor, catchError(async (req: CustomRequest, res: Response) => {
  if (!(await routeHelpers.isLoggedInAdmin(req))) {
    return res.status(403).send({ error: 'User does not have edit rights for this neighborhood.' });
  }

  const data = req.body;
  const updatedNeighborhood: Neighborhood = await prismaClient.neighborhood.update({
    where: { id: +req.params.id },
    data,
  });

  return res.status(200).send(`Neighborhood '${updatedNeighborhood.name}' has been updated.`);
}));

neighborhoodsRouter.post('/', middleware.userExtractor, catchError(async (req: CustomRequest, res: Response) => {
  const userId: number = req.user?.id as number; // user.id shoul be extracted from the middleware
  req.body.admin_id = userId; // adding user_id as admin_id to request.body
  const createNeighborhoodData = await routeHelpers.generateCreateNeighborhoodData(req.body);

  const newNeighborhood: Neighborhood = await prismaClient.neighborhood
    .create({ data: createNeighborhoodData });

  await routeHelpers.connectUsertoNeighborhood(userId, newNeighborhood.id);

  const newNeighborhoodWithRelatedFields = await routeHelpers
    .generateNeighborhoodDataWithRelatedFields(newNeighborhood.id);

  res.status(201).json(newNeighborhoodWithRelatedFields);
}));

neighborhoodsRouter.post('/:id/join', middleware.userExtractor, catchError(async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id as number; // user should be extracted by the middleware
  const neighborhoodId = Number(req.params.id);

  if (!neighborhoodId || Number.isNaN(neighborhoodId)) {
    res.status(400).send({ error: 'Unable to parse URL' });
  } else {
    await routeHelpers.connectUsertoNeighborhood(userId, neighborhoodId);
    res.status(201).send({ success: 'You have joined the neighborhood' });
  }
}));

export default neighborhoodsRouter;
