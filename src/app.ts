import express, { Request, Response, NextFunction } from 'express';
import neighborhoodsRouter from './controllers/neighborhoods';

const app = express();
app.use(express.json());
app.use('/neighborhoods', neighborhoodsRouter);

app.get('/', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

// Default error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(400).send('Oops. Something went wrong.');
});

export default app;
