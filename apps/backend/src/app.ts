import express from 'express';
import neighborhoodsRouter from './controllers/neighborhoods';
import notificationsRouter from './controllers/notifications';
import usersRouter from './controllers/users';
import loginRouter from './controllers/login';
import requestsRouter from './controllers/requests';
import responsesRouter from './controllers/responses';
import middleware from './utils/middleware';

const cors = require('cors');

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
app.use('/api/requests', requestsRouter);
app.use('/api/responses', responsesRouter);
app.use('/api/notifications', notificationsRouter);

// error handler and unknown endpoint
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
