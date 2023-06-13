/* eslint-disable no-underscore-dangle */ // Need to access response._body
// import { Neighborhood, User } from '@prisma/client';
import { Response } from 'supertest';
import app from '../app';
// import prismaClient from '../../prismaClient';
import seed from './seed';
// import testHelpers from './testHelpers';
import { LoginData } from '../types';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const api = supertest(app);

const BOBS_LOGIN_DATA: LoginData = {
  username: 'bob1234',
  password: 'secret',
};

// const MIKES_LOGIN_DATA: LoginData = {
//   username: 'mike',
//   password: 'secret',
// };

// const BOBS_NHOOD_ID = 1;
// const BOBS_USER_ID = 1;
// const ANTONINAS_NHOOD_ID = 2;
// const INVALID_NHOOD_ID = 12345;
const MIKES_REQUEST_ID = 1;

const loginUser = async (loginData: LoginData) => {
  const loginResponse = await api
    .post('/api/login')
    .send(loginData);

  return loginResponse;
};

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
