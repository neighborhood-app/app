/* eslint-disable no-underscore-dangle */ // Need to access response._body
// import { Neighborhood, User } from '@prisma/client';
import { Response } from 'supertest';
import app from '../app';
import prismaClient from '../../prismaClient';
import seed from './seed';
import testHelpers from './testHelpers';
import { LoginData, UpdateRequestData } from '../types';

const supertest = require('supertest'); // eslint-disable-line
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
  const loginResponse = await api
    .post('/api/login')
    .send(loginData);

  return loginResponse;
};

beforeAll(async () => {
  await seed();
});

describe('Tests for updating a request: PUT /requests/:rId', () => {
  let token: string;

  beforeAll(async () => {
    const loginResponse: Response = await loginUser(MIKES_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  beforeEach(async () => {
    await seed();
  });

  // TODO: On line 74, remove the dependency of this PUT request on another GET request
  // test('Update a request\'s title, content and status fields', async () => {
  //   const newData: UpdateRequestData = {
  //     title: 'Test',
  //     content: 'Test',
  //     status: 'CLOSED',
  //   };

  //   const response: Response = await api
  //     .put(`/api/requests/${MIKES_REQUEST_ID}`)
  //     .set('Authorization', `Bearer ${token}`)
  //     .send(newData);

  //   const updatedRequest: Response = await api
  //     .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
  //     .set('Authorization', `Bearer ${token}`);

  //   expect(response.body).toEqual(updatedRequest.body);
  //   expect(response.status).toEqual(200);
  // });

  test('Empty input doesn\'t change anything on the server', async () => {
    const requestBeforeUpdate: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    const request: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(request.body).toEqual(requestBeforeUpdate.body);
    expect(response.status).toEqual(200);
  });

  test('User cannot update request if they didn\'t create it', async () => {
    const loginResponse: Response = await loginUser(BOBS_LOGIN_DATA);
    const bobToken: string = loginResponse.body.token;

    const newData: UpdateRequestData = { title: 'Test' };
    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${bobToken}`)
      .send(newData);

    // Bob is admin of current neighborhood, therefore can fetch the request
    const request: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${bobToken}`);

    expect(response.status).toBe(401);
    expect(request.body!.title).not.toBe(newData.title);
  });

  test('User cannot update request if they aren\'t logged in', async () => {
    const newData: UpdateRequestData = { title: 'Test' };
    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .send(newData);

    const request: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(request.body?.title).not.toBe(newData.title);
  });

  test('Update with invalid properties raises an error', async () => {
    const invalidData = { invalid: 'Test' };
    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);

    const request: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(request.body).not.toHaveProperty('invalid');
  });

  test('Update with invalid values raises an error', async () => {
    const invalidData = {
      title: null,
      content: 2,
      status: 'random string',
    };

    const requestBeforeUpdate: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);

    const request: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(request?.body).toEqual(requestBeforeUpdate?.body);
  });

  test('Id, user_id, neighborhood_id and time_created props cannot be edited', async () => {
    const data = {
      id: 10,
      user_id: BOBS_USER_ID,
      time_created: new Date(),
    };

    const requestBeforeUpdate: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    const request: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(request?.body).toEqual(requestBeforeUpdate?.body);
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
    expect(response.body.error).toBe('unable to parse data');
    expect(request).not.toBe(null);
  });

  test('User cannot delete request if they aren\'t logged in', async () => {
    const response: Response = await api
      .delete(`/api/requests/${MIKES_REQUEST_ID}`);

    const request = await prismaClient.request.findUnique({
      where: { id: MIKES_REQUEST_ID },
    });

    expect(response.status).toEqual(401);
    expect(response.body.error).toBe('user not signed in');
    expect(request).not.toBe(null);
  });
});

describe('Test for changing request status to CLOSED at PUT /request/:id/close', () => {
  beforeEach(async () => {
    await seed();
  });

  test('unable to update at PUT /requests/:id/close when no authentication header present', async () => {
    const putResponse: Response = await api.put(`/api/requests/${MIKES_REQUEST_ID}/close`);

    expect(putResponse.status).toEqual(401);
    expect(putResponse.body.error).toEqual('user not signed in');
  });

  test('unable to update at PUT /requests/:id/close when user did not create the request', async () => {
    const bobsLoginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = bobsLoginResponse.body;

    const putResponse: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}/close`)
      .set('Authorization', `Bearer ${token}`);

    expect(putResponse.status).toEqual(400);
    expect(putResponse.body.error).toEqual('user has not created the request');
  });
});

describe('Test for getting a single request at GET /requests/:id', () => {
  beforeAll(async () => {
    await seed();
  });

  test('GET requests/:id fails when no authorization header present', async () => {
    const getResponse: Response = await api.get(`/api/requests/${MIKES_REQUEST_ID}`);

    expect(getResponse.status).toEqual(401);
    expect(getResponse.body.error).toEqual('user not signed in');
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
    expect(getResponse.body.error).toEqual('user does not have access to the neighborhood');
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
    expect(postResponse.body.error).toEqual('user not signed in');

    expect(numberOfInitialRequests).toEqual(numberOfFinalRequests);
  });

  test('POST /requests fails when token invalid', async () => {
    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const postResponse: Response = await api
      .post('/api/requests')
      .set('Authorization', 'WrongToken');

    const numberOfFinalRequests = await testHelpers.getNumberOfRequests();

    expect(postResponse.status).toEqual(401);
    expect(postResponse.body.error).toEqual('user not signed in');
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
      .send({ title: 'foo', neighborhoodId: BOBS_NHOOD_ID })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    let numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response1.body.error).toEqual('title, content or neighborhoodId missing or invalid');

    // no title
    const response2 = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ neighborhoodId: BOBS_NHOOD_ID, content: 'foo' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response2.body.error).toEqual('title, content or neighborhoodId missing or invalid');

    // no neighborhoodId
    const response = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'foofoo', content: 'barbar' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response.body.error).toBe('title, content or neighborhoodId missing or invalid');
  });

  test('POST /requests fails when neighborhood does not exist', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const response = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'foofoo', content: 'barbar', neighborhoodId: INVALID_NHOOD_ID })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const numberOfFinalRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfFinalRequests).toEqual(numberOfInitialRequests);
    expect(response.body.error).toBe('Neighborhood does not exist');
  });

  test('POST /request fails when content invalid', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const INVALID_TITLE = 'foo';
    const response = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: INVALID_TITLE, content: 'barbar', neighborhoodId: BOBS_NHOOD_ID })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const numberOfFinalRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfFinalRequests).toEqual(numberOfInitialRequests);
    expect(response.body.error).toBe('Invalid title');
  });

  test('POST /request fails when user not a member of the neighborhood', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const response = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'foofoo', content: 'barbar', neighborhoodId: ANTONINAS_NHOOD_ID })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response.body.error).toBe('User is not a member of neighborhood');
  });

  test('POST /request succeeds with valid data', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const initialRequestsAssociatedWithBob = await testHelpers
      .getRequestsAssociatedWithUser(BOBS_USER_ID);
    const numberOfInitialRequestsAssociatedWithBob = initialRequestsAssociatedWithBob.length;

    const initialRequestsAssociatedWithNeighborhood = await testHelpers
      .getRequestsAssociatedWithNeighborhood(BOBS_NHOOD_ID);
    const numInitialRequestsAssociatedWithNeighborhood = initialRequestsAssociatedWithNeighborhood
      .length;

    const response = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'foofoo', content: 'barbar', neighborhoodId: BOBS_NHOOD_ID })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const numberOfFinalRequests = await testHelpers.getNumberOfRequests();

    const finalRequestsAssociatedWithBob = await testHelpers
      .getRequestsAssociatedWithUser(BOBS_USER_ID);
    const numberOfFinalRequestsAssociatedWithBob = finalRequestsAssociatedWithBob.length;
    const bobsRequestContentsAfterCreation = finalRequestsAssociatedWithBob.map(r => r.content);

    const finalRequestsAssociatedWithNeighborhood = await testHelpers
      .getRequestsAssociatedWithNeighborhood(BOBS_NHOOD_ID);
    const numberOfFinalRequestsAssociatedWithNeighborhood = finalRequestsAssociatedWithNeighborhood
      .length;
    const neighborhoodsRequestTitlesAfterCreation = finalRequestsAssociatedWithNeighborhood
      .map(r => r.title);

    expect(response.body.neighborhood_id).toEqual(BOBS_NHOOD_ID);
    expect(response.body.user_id).toEqual(BOBS_USER_ID);
    expect(response.body.title).toEqual('foofoo');
    expect(response.body.content).toEqual('barbar');
    expect(response.body.status).toEqual('OPEN');
    expect(response.body.time_created).toBeDefined();

    expect(numberOfFinalRequests).toEqual(numberOfInitialRequests + 1);

    expect(numberOfFinalRequestsAssociatedWithBob)
      .toEqual(numberOfInitialRequestsAssociatedWithBob + 1);
    expect(bobsRequestContentsAfterCreation).toContain('barbar');

    expect(numberOfFinalRequestsAssociatedWithNeighborhood)
      .toEqual(numInitialRequestsAssociatedWithNeighborhood + 1);
    expect(neighborhoodsRequestTitlesAfterCreation).toContain('foofoo');
  });
});
