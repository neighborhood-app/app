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

export default neighborhoodsRouter;
