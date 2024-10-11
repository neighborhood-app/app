import express from 'express';
import * as formData from 'express-form-data';
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

// parse data with connect-multiparty.
app.use(formData.parse());
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream
app.use(formData.stream());
// union the body and the files
app.use(formData.union());

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
