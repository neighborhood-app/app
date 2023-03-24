import express from 'express';
import Neighborhood from './src/model/neighborhood';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/neighborhoods', async (_req, res) => {
  const neighborhoods = await new Neighborhood().getAllNeighborhoods();
  if (!neighborhoods) return res.sendStatus(404);

  return res.json(neighborhoods);
});

export default app;
