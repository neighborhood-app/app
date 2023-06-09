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

// const ANTONINA_LOGIN_DATA: LoginData = {
//   username: 'antonina',
//   password: 'secret',
// };

// const BOBS_NHOOD_ID = 1;
// const ANTONINAS_NHOOD_ID = 2;

const loginUser = async (loginData: LoginData) => {
  const loginResponse = await api
    .post('/api/login')
    .send(loginData);

  return loginResponse;
};

beforeAll(async () => {
  await testHelpers.removeAllData();
});

describe('Tests for creating a new request', () => {
  beforeAll(async () => {
    await seed();
  });

  test('POST /neighborhoods fails when no token exists', async () => {
    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const postResponse: Response = await api.post('/api/requests');

    const numberOfCurrentRequests = await testHelpers.getNumberOfRequests();

    expect(postResponse.status).toEqual(401);
    expect(numberOfInitialRequests).toEqual(numberOfCurrentRequests);
  });

  test('POST /neighborhoods fails when token invalid', async () => {
    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const postResponse: Response = await api
      .post('/api/requests')
      .set('Authorization', 'WrongToken');

    const numberOfCurrentRequests = await testHelpers.getNumberOfRequests();

    expect(postResponse.status).toEqual(401);
    expect(numberOfInitialRequests).toEqual(numberOfCurrentRequests);
  });

  test('POST /neighborhoods fails when data missing', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    // no content
    await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ neighborhood_id: 1, title: 'foo' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    let numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);

    // no title
    await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ neighborhood_id: 1, content: 'foo' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);

    // no neighborhood_id
    await api
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'foo', content: 'bar' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
  });

  // test for invalid neighborhoodid

  // test for invalid title

  // test when user not a member of neighborhood
});
