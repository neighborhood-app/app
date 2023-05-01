/* eslint-disable no-underscore-dangle */ // Need to access response._body
import app from '../app';
import prismaClient from '../../prismaClient';
import seed from './seed';
import testHelpers from './testHelpers';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const api = supertest(app);

const loginData = {
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
    const neighborhoods = await prismaClient.neighborhood.findMany({});
    const numberOfNeighborhoods = neighborhoods.length;
    const response = await api.get('/api/neighborhoods');
    expect(response.status).toEqual(200);
    // expect(response.body.length).toEqual(3);  // 3 was a magic number.
    expect(response.body.length).toEqual(numberOfNeighborhoods);
  });

  test('DELETE /neighborhoods/:id removes a neighborhood', async () => {
    const initialNeighborhoods = await api.get('/api/neighborhoods');
    const loginResponse = await api
      .post('/api/login')
      .send(loginData);
    const { token } = loginResponse.body;

    const response = await api.delete('/api/neighborhoods/1').set('Authorization', `Bearer ${token}`);
    const currentNeighborhoods = await api.get('/api/neighborhoods');

    expect(response.status).toEqual(200);
    expect(currentNeighborhoods.body.length).toEqual(initialNeighborhoods.body.length - 1);
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
