import express, { Request, Response } from 'express';
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
  const updatedNeighborhood = await prismaClient.neighborhood.update({
    where: { id: +req.params.id },
    data,
  });

  return res.status(200).send(`Neighborhood '${updatedNeighborhood.name}' has been updated.`);
}));

export default neighborhoodsRouter;
