import express from 'express';
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

neighborhoodsRouter.delete('/:id', catchError(async (req, res) => {
  const deletedNeighborhood = await prisma.neighborhood.delete({
    where: { id: +req.params.id },
  });

  res.status(200).send(`Neighborhood '${deletedNeighborhood.name}' has been deleted.`);
}));

neighborhoodsRouter.put('/:id', catchError(async (req, res) => {
  interface UpdateData {
    admin_id?: number,
    name?: string,
    description?: string,
    location?: string
  }

  const data: UpdateData = req.body;
  // console.log(data);

  const updatedNeighborhood = await prisma.neighborhood.update({
    where: { id: +req.params.id },
    data,
  });

  res.status(200).send(`Neighborhood '${updatedNeighborhood.name}' has been updated.`);
}));

export default neighborhoodsRouter;
