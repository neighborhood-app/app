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

neighborhoodsRouter.delete('/:id', middleware.userExtractor, catchError(async (req: CustomRequest, res: Response) => {
  if (req.user && await routeHelpers.isAdmin(req.user.id, Number(req.params.id))) {
    const deletedNeighborhood = await prismaClient.neighborhood.delete({
      where: { id: +req.params.id },
    });
    res.status(200).send(`Neighborhood '${deletedNeighborhood.name}' has been deleted.`);
  } else {
    res.status(403).send({ error: 'User is not the admin of this neighborhood' });
  }
}));

neighborhoodsRouter.put('/:id', catchError(async (req, res) => {
  const data = req.body;
  const updatedNeighborhood = await prismaClient.neighborhood.update({
    where: { id: +req.params.id },
    data,
  });

  res.status(200).send(`Neighborhood '${updatedNeighborhood.name}' has been updated.`);
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

neighborhoodsRouter.post('/:id/join', middleware.userExtractor, catchError(async (_req: CustomRequest, res: Response) => {
  // const neighborhoodId = Number(req.params.id);

  // check if neighborhood valid
  // check if user is not already joined with the neighborhood
  // join user to the neighborhood

  res.status(200).send('user will join the neighborhood');
}));

export default neighborhoodsRouter;
