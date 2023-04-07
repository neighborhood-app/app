import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import catchError from '../utils/catch-error';

const prisma = new PrismaClient({ log: ['query'] });
const neighborhoodsRouter = express.Router();

neighborhoodsRouter.get('/', catchError(async (_req, res) => {
  const neighborhoods = await prisma.neighborhood.findMany({});
  if (neighborhoods.length === 0) {
    res.status(404).end();
  } else {
    res.send(neighborhoods);
  }
}));

export default neighborhoodsRouter;
