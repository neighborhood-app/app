import express from 'express';
import neighborhoodsRouter from './controllers/neighborhoods';
import usersRouter from './controllers/users';
import middleware from './utils/middleware';

const app = express();

// middleware
app.use(express.json());
app.use(middleware.requestLogger);

// routes
app.use('/neighborhoods', neighborhoodsRouter);
app.use('/api/users', usersRouter);

// error handler and unknown endpoint
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
