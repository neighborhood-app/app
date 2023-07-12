import express, { Response } from 'express';
import catchError from '../utils/catchError';
import middleware from '../utils/middleware';
import responseServices from '../services/responseServices';
import { RequestWithAuthentication, ResponseData } from '../types';
import prismaClient from '../../prismaClient';
// import neighborhoodServices from '../services/neighborhoodServices';

const responsesRouter = express.Router();

// Create response
/*
- needs to have content
- need access to request_id
- and user_id (defined in req if user is logged in)
- user needs to be part of the neighborhood to respond
- need neighborhood_id (?)
*/
responsesRouter.post(
  '/',
  middleware.userIdExtractorAndLoginValidator,
  catchError(async (req: RequestWithAuthentication, res: Response) => {
    const loggedUserId: number = req.loggedUserId as number;
    const postData: ResponseData = await responseServices.parseCreateResponseData(req.body);
    // verified that postData has contant and requestId props
    // need to check that request exists
    //  -fetch request from DB and throw if it doesn't exist
    const reqNeighborhood = await prismaClient.request.findUniqueOrThrow({
      where: {
        id: postData.request_id,
      },
      select: {
        neighborhood_id: true,
      },
    });

    // see if user is part of neighborhood
    const neighborhoodUsers = await prismaClient.neighborhood.findUniqueOrThrow({
      where: {
        id: reqNeighborhood.neighborhood_id,
      },
      select: {
        users: true,
      },
    });

    const userIds = neighborhoodUsers.users.map((user) => user.id);
    if (!userIds.includes(loggedUserId)) {
      return res.status(401);
    }

    console.log(loggedUserId, userIds);

    // if they are, allow them to create response
    const response = await responseServices.createResponse(
      postData,
      loggedUserId,
    );

    return res.status(201).send(response);
  }),
);

export default responsesRouter;
