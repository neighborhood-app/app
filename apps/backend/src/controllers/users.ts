import express, { Request, Response } from 'express';
import catchError from '../utils/catchError';
import userServices from '../services/userServices';
import middleware from '../utils/middleware';
import { createSubscriber } from '../services/notificationServices';
import { UserWithoutPasswordHash, RequestWithAuthentication } from '../types';

const usersRouter = express.Router();

// parse data with connect-multiparty.
// usersRouter.use(formData.parse());
// // delete from the request all empty files (size == 0)
// usersRouter.use(formData.format());
// // change the file objects to fs.ReadStream
// usersRouter.use(formData.stream());
// // union the body and the files
// usersRouter.use(formData.union());

usersRouter.get(
  '/',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (_req: Request, res: Response) => {
    const users: Array<UserWithoutPasswordHash> = await userServices.getAllUsers();

    res.status(200).json(users);
  }),
);

usersRouter.get(
  '/:id',
  middleware.userIdExtractorAndLoginValidator,
  middleware.validateURLParams,
  catchError(async (req: Request, res: Response) => {
    const userId: number = Number(req.params.id);

    const user: UserWithoutPasswordHash = await userServices.getUserById(userId);

    res.status(200).json(user);
  }),
);

usersRouter.post(
  '/',
  catchError(async (req: Request, res: Response) => {
    const createUserData = await userServices.parseCreateUserData(req.body);
    const newUser: UserWithoutPasswordHash = await userServices.createUser(createUserData);

    // Create a new subscriber for notifications
    await createSubscriber(
      String(newUser.id),
      newUser.username,
      newUser.first_name || '',
      newUser.last_name || '',
      newUser.image_url || '',
    );

    return res.status(201).json(newUser);
  }),
);

usersRouter.put(
  '/:id',
  middleware.validateURLParams,
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const userId = Number(req.params.id);
    if (!(userId === Number(req.loggedUserId))) {
      return res.status(401).json('Logged user is not the owner of this profile');
    }

    if ('image_url' in req.body && 'path' in req.body.image_url) {
      req.body.image_url = req.body.image_url.path;
    } else {
      req.body.image_url = undefined;
    }
    
    const updatedUser = await userServices.updateUser(req.body, userId);    
    return res.status(200).json(updatedUser);
  }),
);

export default usersRouter;
