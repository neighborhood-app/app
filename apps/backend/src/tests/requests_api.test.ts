/* eslint-disable no-underscore-dangle */ // Need to access response._body
// import { Neighborhood, User } from '@prisma/client';
import { Response } from 'supertest';
import app from '../app';
import prismaClient from '../../prismaClient';
import seed from './seed';
import testHelpers from './testHelpers';
import { LoginData, UpdateRequestData } from '../types';

const supertest = require("supertest"); // eslint-disable-line
// 'require' was used because supertest does not support import

const api = supertest(app);

const BOBS_LOGIN_DATA: LoginData = {
  username: 'bob1234',
  password: 'secret',
};

const MIKES_LOGIN_DATA: LoginData = {
  username: 'mike',
  password: 'secret',
};

const ANTONINA_LOGIN_DATA: LoginData = {
  username: 'antonina',
  password: 'secret',
};

// const ANTONINAS_NHOOD_ID = 2;
// const INVALID_NHOOD_ID = 12345;
const BOBS_NHOOD_ID = 1;
const BOBS_USER_ID = 1;
const MIKES_REQUEST_ID = 1;
const RADUS_REQUEST_ID = 2;
const MIKES_USER_ID = 5;
const MIKES_REQUEST_TITLE = 'Help moving furniture in apartment';
const INVALID_NHOOD_ID = 1000;
const ANTONINAS_NHOOD_ID = 2;

const loginUser = async (loginData: LoginData) => {
  const loginResponse = await api.post('/api/login').send(loginData);

  return loginResponse;
};

beforeAll(async () => {
  await seed();
});

describe('Tests for updating a request: PUT /requests/:id', () => {
  let token: string;

  beforeAll(async () => {
    const loginResponse: Response = await loginUser(MIKES_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  beforeEach(async () => {
    await seed();
  });

  // We need to remove dependency on non-existent routes, instead use testHelpers.getSingleRequest()

  // These tests should not pass as the routes to get individual request have been moved from
  // controllers/neighborhood.ts to controllers/requests.ts. Checking for proper error message
  // could have prevented it.

  // Thats why we should not try to make our test coupled on lots of
  // functionality within source code and use test helpers instead.

  test("Update a request's title, content and status fields", async () => {
    const newData: UpdateRequestData = {
      title: 'Test',
      content: 'Test',
      status: 'CLOSED',
    };
    const initialRequest = await testHelpers.getSingleRequest(MIKES_REQUEST_ID);

    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData);

    // tests for correctness of response
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      ...initialRequest,
      ...newData,
      time_created: initialRequest.time_created.toJSON(),
    });

    // tests for correctness of database update
    // fields that were not updated should remain the same
    const updatedRequest = await testHelpers.getSingleRequest(MIKES_REQUEST_ID);
    expect(updatedRequest).toEqual({
      ...initialRequest,
      ...newData,
    });
  });

  test("Empty input doesn't change anything on the server", async () => {
    const requestBeforeUpdate = await testHelpers.getSingleRequest(MIKES_REQUEST_ID);

    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    const request = await testHelpers.getSingleRequest(MIKES_REQUEST_ID);

    expect(request).toEqual(requestBeforeUpdate);
    expect(response.status).toEqual(200);
  });

  test("User cannot update request if they didn't create it", async () => {
    const loginResponse: Response = await loginUser(BOBS_LOGIN_DATA);
    const bobToken: string = loginResponse.body.token;

    const newData: UpdateRequestData = { title: 'Test' };
    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${bobToken}`)
      .send(newData);

    const requestInDbAfterUpdate = await testHelpers.getSingleRequest(
      MIKES_REQUEST_ID,
    );

    expect(response.status).toBe(401);
    expect(requestInDbAfterUpdate.title).not.toBe(newData.title);
  });

  test("User cannot update request if they aren't logged in", async () => {
    const newData: UpdateRequestData = { title: 'Test' };

    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .send(newData);

    const requestInDbAfterUpdate = await testHelpers.getSingleRequest(
      MIKES_REQUEST_ID,
    );

    expect(response.status).toBe(401);
    expect(requestInDbAfterUpdate.title).not.toBe(newData.title);
  });

  test('Update with invalid properties raises an error', async () => {
    const invalidData = { invalid: 'Test' };

    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);

    const requestInDbAfterUpdate = await testHelpers.getSingleRequest(
      MIKES_REQUEST_ID,
    );

    expect(response.status).toBe(400);
    expect(requestInDbAfterUpdate).not.toHaveProperty('invalid');
  });

  test('Update with invalid values raises an error', async () => {
    const invalidData = {
      title: null,
      content: 2,
      status: 'random string',
    };

    const requestInDbBeforeUpdate = await testHelpers.getSingleRequest(
      MIKES_REQUEST_ID,
    );

    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);

    const requestInDbAfterUpdate = await testHelpers.getSingleRequest(
      MIKES_REQUEST_ID,
    );

    expect(response.status).toBe(400);
    expect(requestInDbAfterUpdate).toEqual(requestInDbBeforeUpdate);
  });

  test('Id, user_id, neighborhood_id and time_created props cannot be edited', async () => {
    const requestInDbBeforeUpdate = await testHelpers.getSingleRequest(
      MIKES_REQUEST_ID,
    );

    // fails to update id
    const response1 = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: 1000 });

    expect(response1.status).toBe(400);

    // fails to update user_id
    const response2 = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: 1000 });

    expect(response2.status).toBe(400);

    // fails to update neighborhood_id
    const response3 = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ neighborhood_id: 1000 });

    expect(response3.status).toBe(400);

    // fails to update time_created
    const response4 = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ time_created: new Date() });

    expect(response4.status).toBe(400);

    const requestInDbAfterUpdate = await testHelpers.getSingleRequest(
      MIKES_REQUEST_ID,
    );
    expect(requestInDbAfterUpdate).toEqual(requestInDbBeforeUpdate);
  });

  test('Able to change to status of request to CLOSED', async () => {
    const initialRequest = await testHelpers.getSingleRequest(MIKES_REQUEST_ID);
    expect(initialRequest.status).toBe('OPEN');

    const updateData = {
      status: 'CLOSED',
    };

    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(MIKES_REQUEST_ID);
    expect(response.body.status).toBe('CLOSED');
    expect(response.body.title).toBe(initialRequest.title);
    expect(response.body.content).toBe(initialRequest.content);
  });
});

describe('Tests for deleting a request: DELETE /requests/:rId', () => {
  let token: string;

  beforeAll(async () => {
    const loginResponse: Response = await loginUser(MIKES_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  beforeEach(async () => {
    await seed();
  });

  test('Delete an existing request as the creator', async () => {
    const response: Response = await api
      .delete(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    const deleted = await prismaClient.request.findUnique({
      where: { id: MIKES_REQUEST_ID },
    });

    expect(response.status).toEqual(204);
    expect(deleted).toBe(null);
  });

  test('Delete an existing request as admin of neighborhood', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const bobToken: string = loginResponse.body.token;

    const response: Response = await api
      .delete(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${bobToken}`);

    const deleted = await prismaClient.request.findUnique({
      where: { id: MIKES_REQUEST_ID },
    });

    expect(response.status).toEqual(204);
    expect(deleted).toBe(null);
  });

  test('User cannot delete request if not its creator or admin', async () => {
    const loginResponse = await loginUser(ANTONINA_LOGIN_DATA);
    const antoninaToken: string = loginResponse.body.token;

    const response: Response = await api
      .delete(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${antoninaToken}`);

    const request = await prismaClient.request.findUnique({
      where: { id: MIKES_REQUEST_ID },
    });

    expect(response.status).toEqual(401);
    expect(request).not.toBe(null);
  });

  test('Delete non-existent request fails', async () => {
    const NON_EXISTENT_ID = 1000;
    const response: Response = await api
      .delete(`/api/requests/${NON_EXISTENT_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No Request found');
  });

  test('Invalid requestId fails the deletion', async () => {
    const response: Response = await api
      .delete(`/api/requests/${MIKES_REQUEST_ID}foo`)
      .set('Authorization', `Bearer ${token}`);

    const request = await prismaClient.request.findUnique({
      where: { id: MIKES_REQUEST_ID },
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid URL.');
    expect(request).not.toBe(null);
  });

  test("User cannot delete request if they aren't logged in", async () => {
    const response: Response = await api.delete(
      `/api/requests/${MIKES_REQUEST_ID}`,
    );

    const request = await prismaClient.request.findUnique({
      where: { id: MIKES_REQUEST_ID },
    });

    expect(response.status).toEqual(401);
    expect(response.body.error).toBe('You must be signed in to do that.');
    expect(request).not.toBe(null);
  });
});

describe('Test for getting a single request at GET /requests/:id', () => {
  beforeAll(async () => {
    await seed();
  });

  test('GET requests/:id fails when no authorization header present', async () => {
    const getResponse: Response = await api.get(
      `/api/requests/${MIKES_REQUEST_ID}`,
    );

    expect(getResponse.status).toEqual(401);
    expect(getResponse.body.error).toEqual('You must be signed in to do that.');
  });

  test('GET /requests/:id/ fails when user request not found', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;
    const INVALID_REQUEST_ID = 1000;

    const getResponse: Response = await api
      .get(`/api/requests/${INVALID_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).toEqual(404);
    expect(getResponse.body.error).toEqual('No Request found');
  });

  test('GET /requests/:id/ fails when user not a member of requests neighborhood', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const getResponse: Response = await api
      .get(`/api/requests/${RADUS_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).toEqual(401);
    expect(getResponse.body.error).toEqual(
      'user does not have access to the neighborhood',
    );
  });

  test('GET /requests/:id/ works with valid data', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const getResponse: Response = await api
      .get(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).toEqual(200);
    expect(getResponse.body.user_id).toBe(MIKES_USER_ID);
    expect(getResponse.body.title).toBe(MIKES_REQUEST_TITLE);
  });
});

describe('Tests for creating a new request at POST /requests', () => {
  beforeEach(async () => {
    await seed();
  });

  test('POST /requests fails when no token exists', async () => {
    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const postResponse: Response = await api.post('/api/requests');

    const numberOfFinalRequests = await testHelpers.getNumberOfRequests();

    expect(postResponse.status).toEqual(401);
    expect(postResponse.body.error).toEqual('You must be signed in to do that.');

    expect(numberOfInitialRequests).toEqual(numberOfFinalRequests);
  });

  test('POST /requests fails when token invalid', async () => {
    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const postResponse: Response = await api
      .post('/api/requests')
      .set('Authorization', 'WrongToken');

    const numberOfFinalRequests = await testHelpers.getNumberOfRequests();

    expect(postResponse.status).toEqual(401);
    expect(postResponse.body.error).toEqual('You must be signed in to do that.');
    expect(numberOfInitialRequests).toEqual(numberOfFinalRequests);
  });

  test('POST /requests fails when data missing', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    // no content
    const response1 = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'foo', neighborhood_id: BOBS_NHOOD_ID })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    let numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response1.body.error).toEqual(
      'Title, content or neighborhood ID missing or invalid.',
    );

    // no title
    const response2 = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ neighborhood_id: BOBS_NHOOD_ID, content: 'foo' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response2.body.error).toEqual(
      'Title, content or neighborhood ID missing or invalid.',
    );

    // no neighborhood_id
    const response = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'foofoo', content: 'barbar' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response.body.error).toBe(
      'Title, content or neighborhood ID missing or invalid.',
    );
  });

  test('POST /requests fails when neighborhood does not exist', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const response = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'foofoo',
        content: 'barbar',
        neighborhood_id: INVALID_NHOOD_ID,
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const numberOfFinalRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfFinalRequests).toEqual(numberOfInitialRequests);
    expect(response.body.error).toBe('Neighborhood does not exist');
  });

  test('POST /request fails when title invalid', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const INVALID_TITLE = 'foo';
    const response = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: INVALID_TITLE,
        content: 'barbar',
        neighborhood_id: BOBS_NHOOD_ID,
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const numberOfFinalRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfFinalRequests).toEqual(numberOfInitialRequests);
    expect(response.body.error).toBe('Title must be at least 4 characters long.');
  });

  test('POST /request fails when content invalid', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const INVALID_CONTENT = 'foo';
    const response = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test',
        content: INVALID_CONTENT,
        neighborhood_id: BOBS_NHOOD_ID,
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const numberOfFinalRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfFinalRequests).toEqual(numberOfInitialRequests);
    expect(response.body.error).toBe('Content must be at least 4 characters long.');
  });

  test('POST /request fails when user not a member of the neighborhood', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const response = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'foofoo',
        content: 'barbar',
        neighborhood_id: ANTONINAS_NHOOD_ID,
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response.body.error).toBe('User is not a member of neighborhood');
  });

  test('POST /request succeeds with valid data', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numOfInitialRequests = await testHelpers.getNumberOfRequests();

    const bobsInitalRequests = await testHelpers.getRequestsOfUser(BOBS_USER_ID);
    const initialNumOfBobsRequests = bobsInitalRequests.length;

    const initialNeighborhoodRequests = await testHelpers.getNeighborhoodRequests(BOBS_NHOOD_ID);
    const numOfInitialNeighborhoodReuqests = initialNeighborhoodRequests.length;

    const response = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'foofoo',
        content: 'barbar',
        neighborhood_id: BOBS_NHOOD_ID,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const numOfFinalRequests = await testHelpers.getNumberOfRequests();
    const bobsFinalRequests = await testHelpers.getRequestsOfUser(BOBS_USER_ID);
    const finalNumOfBobsRequests = bobsFinalRequests.length;
    const bobsRequestContentsAfterCreation = bobsFinalRequests.map((req) => req.content);

    const finalNeighborhoodRequests = await testHelpers.getNeighborhoodRequests(BOBS_NHOOD_ID);
    const numOfFinalNeighborhoodRequests = finalNeighborhoodRequests.length;
    const neighborhoodsReqTitlesAfterCreation = finalNeighborhoodRequests.map((req) => req.title);

    expect(response.body.neighborhood_id).toEqual(BOBS_NHOOD_ID);
    expect(response.body.user_id).toEqual(BOBS_USER_ID);
    expect(response.body.title).toEqual('foofoo');
    expect(response.body.content).toEqual('barbar');
    expect(response.body.status).toEqual('OPEN');
    expect(response.body.time_created).toBeDefined();

    expect(numOfFinalRequests).toEqual(numOfInitialRequests + 1);
    expect(finalNumOfBobsRequests).toEqual(initialNumOfBobsRequests + 1);
    expect(bobsRequestContentsAfterCreation).toContain('barbar');

    expect(numOfFinalNeighborhoodRequests).toEqual(
      numOfInitialNeighborhoodReuqests + 1,
    );
    expect(neighborhoodsReqTitlesAfterCreation).toContain('foofoo');
  });
});
