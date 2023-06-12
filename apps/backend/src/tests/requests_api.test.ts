/* eslint-disable no-underscore-dangle */ // Need to access response._body
// import { Neighborhood, User } from '@prisma/client';
import { Response } from 'supertest';
import app from '../app';
// import prismaClient from '../../prismaClient';
import seed from './seed';
import testHelpers from './testHelpers';
import { LoginData } from '../types';

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

const BOBS_NHOOD_ID = 1;
const BOBS_USER_ID = 1;
const ANTONINAS_NHOOD_ID = 2;
const INVALID_NHOOD_ID = 12345;
const MIKES_REQUEST_ID = 1;

const loginUser = async (loginData: LoginData) => {
  const loginResponse = await api
    .post('/api/login')
    .send(loginData);

  return loginResponse;
};

beforeAll(async () => {
  await testHelpers.removeAllData();
});

describe('Tests for creating a new request at POST /requests', () => {
  beforeEach(async () => {
    await seed();
  });

  test('POST /request fails when no token exists', async () => {
    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const postResponse: Response = await api.post('/api/requests');

    const numberOfCurrentRequests = await testHelpers.getNumberOfRequests();

    expect(postResponse.status).toEqual(401);
    expect(postResponse.body.error).toEqual('user not signed in');

    expect(numberOfInitialRequests).toEqual(numberOfCurrentRequests);
  });

  test('POST /request fails when token invalid', async () => {
    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const postResponse: Response = await api
      .post('/api/requests')
      .set('Authorization', 'WrongToken');

    const numberOfCurrentRequests = await testHelpers.getNumberOfRequests();

    expect(postResponse.status).toEqual(401);
    expect(postResponse.body.error).toEqual('user not signed in');
    expect(numberOfInitialRequests).toEqual(numberOfCurrentRequests);
  });

  test('POST /request fails when data missing', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    // no content
    const response1 = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ neighborhood_id: BOBS_NHOOD_ID, title: 'foo' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    let numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response1.body.error).toEqual('neighborhood_id, title or content missing or invalid');

    // no title
    const response2 = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ neighborhood_id: BOBS_NHOOD_ID, content: 'foo' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response2.body.error).toEqual('neighborhood_id, title or content missing or invalid');

    // no neighborhood_id
    const response3 = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'foo', content: 'bar' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response3.body.error).toEqual('neighborhood_id, title or content missing or invalid');
  });

  test('POST /request fails when neighborhood does not exist', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const response = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ neighborhood_id: INVALID_NHOOD_ID, title: 'foofoo', content: 'barbar' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
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
      .send({ neighborhood_id: BOBS_NHOOD_ID, title: INVALID_TITLE, content: 'barbar' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response.body.error).toBe('Invalid title');
  });

  test('POST /request fails when user not a member of the neighborhood', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const response = await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ neighborhood_id: ANTONINAS_NHOOD_ID, title: 'foofoo', content: 'barbar' })
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
      .send({ neighborhood_id: BOBS_NHOOD_ID, title: 'foofoo', content: 'barbar' })
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
