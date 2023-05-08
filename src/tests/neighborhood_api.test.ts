/* eslint-disable no-underscore-dangle */ // Need to access response._body
import { Neighborhood, User } from '@prisma/client';
import app from '../app';
import prismaClient from '../../prismaClient';
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
      .send(BOBS_LOGIN_DATA);

    const { token } = loginResponse.body;

    // 1 is valid neighborhood id for BOBS_LOGIN_DATA
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
      .send(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    // 2 is invalid neighborhood id for BOBS_LOGIN_DATA
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

describe('Testing UPDATE method for neighborhood API.', () => {
  beforeEach(async () => {
    await seed();
  });

  test('Update all of a neighborhood\'s fields by id', async () => {
    const neighborhoodToUpdate = await prismaClient.neighborhood.findFirst({
      where: {
        name: "Antonina's Neighborhood",
      },
    });

    const newAdmin = await prismaClient.user.findFirst({
      where: {
        NOT: { id: neighborhoodToUpdate!.admin_id },
      },
    });

    const newData = {
      name: 'Test',
      description: 'Test',
      admin_id: newAdmin!.id,
      location: 'Athens',
    };

    const response = await api.put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`).send(newData);

    expect(response.text).toEqual('Neighborhood \'Test\' has been updated.');
    expect(response.status).toEqual(200);
    expect(await prismaClient.neighborhood.findFirst({
      where: { id: neighborhoodToUpdate!.id },
    })).toEqual({
      id: neighborhoodToUpdate!.id,
      ...newData,
    });
  });

  test('Partial update works', async () => {
    const neighborhoodToUpdate = await prismaClient.neighborhood.findFirst({
      where: {
        name: "Antonina's Neighborhood",
      },
    });

    const newData = { name: 'Test' };
    const response = await api.put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`).send(newData);

    expect(response.text).toEqual('Neighborhood \'Test\' has been updated.');
    expect(response.status).toEqual(200);
    expect(await prismaClient.neighborhood.findFirst({
      where: { id: neighborhoodToUpdate!.id },
    })).toEqual({
      ...neighborhoodToUpdate,
      name: newData.name,
    });
  });

  test('Empty input doesn\'t change anything on the server', async () => {
    const neighborhoodToUpdate = await prismaClient.neighborhood.findFirst({
      where: {
        name: "Antonina's Neighborhood",
      },
    });

    const response = await api.put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`).send({});

    expect(response.text).toEqual('Neighborhood \'Antonina\'s Neighborhood\' has been updated.');
    expect(response.status).toEqual(200);
    expect(await prismaClient.neighborhood.findFirst({
      where: { id: neighborhoodToUpdate!.id },
    })).toEqual({
      ...neighborhoodToUpdate,
    });
  });

  test('Update with invalid properties raises an error', async () => {
    const neighborhoodToUpdate = await prismaClient.neighborhood.findFirst({
      where: {
        name: "Antonina's Neighborhood",
      },
    });

    const newData = {
      name: 'Test',
      description: 'Test',
      location: 'Athens',
      invalid: 'Non-existent prop',
    };

    const response = await api.put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`).send(newData);
    expect(response.status).toEqual(400);
  });

  test('Update with invalid property value types fails', async () => {
    const neighborhoodToUpdate = await prismaClient.neighborhood.findFirst({
      where: {
        name: "Antonina's Neighborhood",
      },
    });

    const newData = {
      name: 1000,
      description: [1, 2, 3],
    };

    const response = await api.put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`).send(newData);
    expect(response.status).toEqual(400);
  });

  test('Non-existent admin_id raises a 400 error', async () => {
    const neighborhoodToUpdate = await prismaClient.neighborhood.findFirst({
      where: {
        name: "Antonina's Neighborhood",
      },
    });

    const newData = { admin_id: 1000 };
    const response = await api.put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`).send(newData);

    expect(response.status).toEqual(400);
    expect(await prismaClient.neighborhood.findFirst({
      where: { id: neighborhoodToUpdate!.id },
    })).toEqual({
      ...neighborhoodToUpdate,
    });
  });

  test('Non-existent neighborhood id raises a 404 error', async () => {
    const NON_EXISTENT_ID = 399495;
    const newData = { name: 'Test' };
    const response = await api.put(`/api/neighborhoods/${NON_EXISTENT_ID}`).send(newData);

    expect(response.status).toEqual(404);
  });
});

describe('Testing CREATE neighborhood at POST /api/neighborhood', () => {
  beforeEach(async () => {
    await seed();
  });

  test('when user not logged in, unable to create neighborhood', async () => {
    const initialNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numInitialNeighborhoods = initialNeighborhoods.length;

    const postResponse = await api.post('/api/neighborhoods');

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(postResponse.status).toEqual(401);
    expect(numCurrentNeighborhoods).toEqual(numInitialNeighborhoods);
  });

  test('when user logged in, able to create neighborhood with valid data', async () => {
    const initialNeighborhoods: Array<Neighborhood> = await testHelpers.neighborhoodsInDb();
    const numInitialNeighborhoods: number = initialNeighborhoods.length;

    const bobUser: User | null = await prismaClient.user.findUnique({
      where: {
        user_name: BOBS_LOGIN_DATA.username,
      },
    });

    const bobUserId: number | undefined = bobUser?.id;

    const loginResponse = await api
      .post('/api/login')
      .send(BOBS_LOGIN_DATA);

    const { token } = loginResponse.body;

    const NEW_NEIGHBORHOOD_NAME = 'new-neighborhood';

    const createNeighborhoodResponse = await api.post('/api/neighborhoods')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: NEW_NEIGHBORHOOD_NAME })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const neighborhoodUsers = createNeighborhoodResponse.body.users;

    const userNames = neighborhoodUsers.map((u: { user_name: any; }) => u.user_name);
    expect(userNames).toContain(BOBS_LOGIN_DATA.username);

    expect(createNeighborhoodResponse.body.name).toBe(NEW_NEIGHBORHOOD_NAME);
    expect(createNeighborhoodResponse.body.admin_id).toBe(bobUserId);

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(numCurrentNeighborhoods).toBe(numInitialNeighborhoods + 1);

    const currentNeighborhoodNames = currentNeighborhoods.map(n => n.name);
    expect(currentNeighborhoodNames).toContain(NEW_NEIGHBORHOOD_NAME);
  });

  test('when user logged in, unable to create neighborhood with invalid neighborhood name', async () => {
    const initialNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numInitialNeighborhoods = initialNeighborhoods.length;

    const loginResponse = await api
      .post('/api/login')
      .send(BOBS_LOGIN_DATA);

    const { token } = loginResponse.body;

    const NEW_NEIGHBORHOOD_NAME = 'new'; // invalid because shorter than 4 characters

    const createResponse = await api.post('/api/neighborhoods')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: NEW_NEIGHBORHOOD_NAME })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(createResponse.body.error).toBeDefined();

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(numCurrentNeighborhoods).toBe(numInitialNeighborhoods);
  });

  test('when user logged in, unable to create neighborhood with existing neighborhood name', async () => {
    const initialNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numInitialNeighborhoods = initialNeighborhoods.length;

    const loginResponse = await api
      .post('/api/login')
      .send(BOBS_LOGIN_DATA);

    const { token } = loginResponse.body;

    const existingNeighborhoodName = initialNeighborhoods[0].name;

    const createResponse = await api.post('/api/neighborhoods')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: existingNeighborhoodName })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(createResponse.body.error).toBeDefined();

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(numCurrentNeighborhoods).toBe(numInitialNeighborhoods);
  });
});
