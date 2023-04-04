import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query'] });
const neighborhoodsRouter = express.Router();

neighborhoodsRouter.get('/', async (_req, res) => {
  try {
    const neighborhoods = await prisma.neighborhood.findMany({});
    if (neighborhoods.length === 0) {
      res.status(404).end();
    } else {
      res.send(neighborhoods);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

export default neighborhoodsRouter;