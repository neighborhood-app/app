/* eslint-disable no-underscore-dangle */ // Need to access response._body
import app from '../app';
import prismaClient from '../../prismaClient';
import seed from './seed';
import testHelpers from './testHelpers';
import { LoginData } from '../types';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const api = supertest(app);

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

  test('User cannot delete neighborhood if user is not admin', async () => {
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

  test('User cannot delete neighborhood if user is not logged in', async () => {
    const initialNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numInitialNeighborhoods = initialNeighborhoods.length;

    const deleteResponse = await api.delete('/api/neighborhoods/1');

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(deleteResponse.status).toEqual(401);
    expect(numInitialNeighborhoods).toEqual(numCurrentNeighborhoods);
  });

  test('GET /neighborhoods/id existing id returns single neignborhood', async () => {
    const neighborhood = await prismaClient.neighborhood.findFirst({
      where: { name: "Bob's Neighborhood" },
    });
    const id = neighborhood?.id;
    const response = await api.get(`/api/neighborhoods/${id}`);
    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(id);
  });

  test('GET /neighborhoods/id invalid id returns expected error', async () => {
    const response = await api.get(`/api/neighborhoods/0`);
    expect(response.status).toEqual(404);
    expect(response.body.error).toEqual('No Neighborhood found');
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
