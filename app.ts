import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import catchError from './src/utils/catch-error';

const prisma = new PrismaClient({ log: ['query'] });
const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/neighborhoods', catchError(async (_req, res) => {
  const neighborhoods = await prisma.neighborhood.findMany({});
  if (neighborhoods.length === 0) {
    res.status(404).end();
  } else {
    res.send(neighborhoods);
  }
}));

// Default error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(400).send('Oops. Something went wrong.');
});

export default app;
