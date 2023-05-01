/* eslint-disable no-underscore-dangle */ // Need to access response._body
import app from '../app';
import prismaClient from '../../prismaClient';
import seed from './seed';
import testHelpers from './testHelpers';
import { LoginData } from '../types';
import routeHelpers from '../utils/routeHelpers';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const api = supertest(app);

const loginData: LoginData = {
  username: 'bob',
  password: 'secret',
};

const LOGIN_DATA: LoginData = {
  username: 'bob',
  password: 'secret',
};

beforeAll(async () => {
  await testHelpers.removeAllData();
});

describe('When neighborhoods already exist in the db', () => {
  beforeEach(async () => {
    await seed();
  });

  test('GET /neighborhoods returns all neighborhoods', async () => {
    const neighborhoods = await testHelpers.neighborhoodsInDb();
    const numberOfNeighborhoods = neighborhoods.length;
    const response = await api.get('/api/neighborhoods');
    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(numberOfNeighborhoods);
  });

  test('DELETE /neighborhoods/:id removes a neighborhood', async () => {
    const initialNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numInitialNeighborhoods = initialNeighborhoods.length;

    const loginResponse = await api
      .post('/api/login')
      .send(LOGIN_DATA);

    const { token } = loginResponse.body;

    // 1 is valid neighborhood id for LOGIN_DATA
    const deleteResponse = await api.delete('/api/neighborhoods/1')
      .set('Authorization', `Bearer ${token}`);

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(deleteResponse.status).toEqual(200);
    expect(numCurrentNeighborhoods).toEqual(numInitialNeighborhoods - 1);
  });

  test('User cannot delete neighborhood if he/she is not admin', async () => {
    const initialNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numInitialNeighborhoods = initialNeighborhoods.length;

    const loginResponse = await api
      .post('/api/login')
      .send(LOGIN_DATA);
    const { token } = loginResponse.body;

    // 2 is invalid neighborhood id for LOGIN_DATA
    const deleteResponse = await api.delete('/api/neighborhoods/2').set('Authorization', `Bearer ${token}`);

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(deleteResponse.status).toEqual(403);
    expect(numCurrentNeighborhoods).toEqual(numInitialNeighborhoods);
  });

  test('User cannot delete neighborhood if he/she is not logged in', async () => {
    const initialNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numInitialNeighborhoods = initialNeighborhoods.length;

    const deleteResponse = await api.delete('/api/neighborhoods/1');

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(deleteResponse.status).toEqual(401);
    expect(numInitialNeighborhoods).toEqual(numCurrentNeighborhoods);
  });
});

describe('When no neighborhood exists in the db', () => {
  beforeEach(async () => {
    await prismaClient.neighborhood.deleteMany({});
  });

  test('GET /neighborhoods return 404', async () => {
    const response = await api.get('/api/neighborhoods');
    expect(response.status).toEqual(404);
  });
});
