/* eslint-disable no-underscore-dangle */ // Need to access response._body
// import { Neighborhood, User } from '@prisma/client';
import { Response } from 'supertest';
import app from '../app';
// import prismaClient from '../../prismaClient';
import seed from './seed';
// import testHelpers from './testHelpers';
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

// const ANTONINAS_NHOOD_ID = 2;
// const INVALID_NHOOD_ID = 12345;
const BOBS_NHOOD_ID = 1;
const BOBS_USER_ID = 1;
const MIKES_REQUEST_ID = 1;

const loginUser = async (loginData: LoginData) => {
  const loginResponse = await api
    .post('/api/login')
    .send(loginData);

  return loginResponse;
};

beforeAll(async () => {
  await seed();
});

describe('Tests for updating a request: PUT /neighborhoods/:nId/requests/:rId', () => {
  let token: string;

  beforeAll(async () => {
    const loginResponse: Response = await loginUser(MIKES_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  beforeEach(async () => {
    await seed();
  });

  test('Update a request\'s title, content and status fields', async () => {
    const newData: UpdateRequestData = {
      title: 'Test',
      content: 'Test',
      status: 'CLOSED',
    };

    const response: Response = await api
      .put(`/api/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData);

    const updatedRequest: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual(updatedRequest.body);
    expect(response.status).toEqual(200);
  });

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
