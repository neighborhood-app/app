import express from 'express';

import { PrismaClient } from '@prisma/client';
import config from './src/utils/config';

const prisma = new PrismaClient({ log: ['query'] });
const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/neighborhoods', async (_req, res) => {
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

export default app;
