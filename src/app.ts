import express from 'express';
import neighborhoodsRouter from './controllers/neighborhoods';

const app = express();
app.use(express.json());
app.use('/neighborhoods', neighborhoodsRouter);

app.get('/', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

export default app;
