import express, { Request, Response } from 'express';
import catchError from '../utils/catchError';
import prismaClient from '../../prismaClient';

const neighborhoodsRouter = express.Router();

neighborhoodsRouter.get('/', catchError(async (_req: Request, res: Response) => {
  const neighborhoods = await prismaClient.neighborhood.findMany({});
  if (neighborhoods.length === 0) {
    res.status(404).end();
  } else {
    res.send(neighborhoods);
  }
}));

neighborhoodsRouter.get('/:id', catchError(async (req: Request, res: Response) => {
  const neighborhood = await prismaClient.neighborhood.findUniqueOrThrow({
    where: { id: +req.params.id },
  });
  res.send(neighborhood);
}));

neighborhoodsRouter.delete('/:id', catchError(async (req: Request, res: Response) => {
  const deletedNeighborhood = await prismaClient.neighborhood.delete({
    where: { id: +req.params.id },
  });

  res.status(200).send(`Neighborhood '${deletedNeighborhood.name}' has been deleted.`);
}));

export default neighborhoodsRouter;
