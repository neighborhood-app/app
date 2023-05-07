import express from 'express';
const cors = require('cors');
import neighborhoodsRouter from './controllers/neighborhoods';
import usersRouter from './controllers/users';
import loginRouter from './controllers/login';
import middleware from './utils/middleware';

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

// routes
app.use('/api/neighborhoods', neighborhoodsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

// error handler and unknown endpoint
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
