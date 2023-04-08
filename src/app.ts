import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors'; // no lint error through npm run lint

import neighborhoodsRouter from './controllers/neighborhoods';
import middleware from './utils/middleware';

const app = express();

app.use(express.json());
app.use(middleware.requestLogger);

// routes
app.use('/neighborhoods', neighborhoodsRouter);

app.use(middleware.unknownEndpoint);

// // Default error handler
// app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
//   console.error(err);
//   res.status(400).send('Oops. Something went wrong.');
// });

export default app;
