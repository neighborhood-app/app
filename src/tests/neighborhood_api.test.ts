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

describe('Testing UPDATE method for neighborhood API.', () => {
  let token: string;

  beforeEach(async () => {
    await seed();

    const loginResponse = await api
      .post('/api/login')
      .send(LOGIN_DATA);

    token = loginResponse.body.token;
  });

  test('Update all of a neighborhood\'s fields by id', async () => {
    const neighborhoodToUpdate = await prismaClient.neighborhood.findFirst({
      where: {
        name: "Bob's Neighborhood",
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

    const response = await api
      .put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData);

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
        name: "Bob's Neighborhood",
      },
    });

    const newData = { name: 'Test' };
    const response = await api
      .put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData);

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
        name: "Bob's Neighborhood",
      },
    });

    const response = await api
      .put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.text).toEqual('Neighborhood \'Bob\'s Neighborhood\' has been updated.');
    expect(response.status).toEqual(200);
    expect(await prismaClient.neighborhood.findFirst({
      where: { id: neighborhoodToUpdate!.id },
    })).toEqual({
      ...neighborhoodToUpdate,
    });
  });

  test('User cannot update neighborhood if they aren\'t admin', async () => {
    const neighborhoodToUpdate = await prismaClient.neighborhood.findFirst({
      where: {
        name: "Antonina's Neighborhood",
      },
    });

    const newData = { name: 'Test' };
    const updateResponse = await api
      .put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData);

    const updatedNeighborhood = await prismaClient.neighborhood.findFirst({
      where: {
        id: neighborhoodToUpdate!.id,
      },
    });

    expect(updateResponse.status).toBe(403);
    expect(updatedNeighborhood!.name).not.toBe(newData.name);
  });

  test('User cannot update neighborhood if they aren\'t logged in', async () => {
    const neighborhoodToUpdate = await prismaClient.neighborhood.findFirst({});
    const newData = { name: 'Test' };

    const updateResponse = await api
      .put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`)
      .send(newData);

    const updatedNeighborhood = await prismaClient.neighborhood.findFirst({
      where: { id: 1 },
    });

    expect(updateResponse.status).toBe(401);
    expect(updatedNeighborhood!.name).not.toBe(newData.name);
  });

  test('Update with invalid properties raises an error', async () => {
    const neighborhoodToUpdate = await prismaClient.neighborhood.findFirst({
      where: {
        name: "Bob's Neighborhood",
      },
    });

    const newData = {
      name: 'Test',
      description: 'Test',
      location: 'Athens',
      invalid: 'Non-existent prop',
    };

    const response = await api
      .put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData);

    expect(response.status).toBe(400);
  });

  test('Update with invalid property value types fails', async () => {
    const neighborhoodToUpdate = await prismaClient.neighborhood.findFirst({
      where: {
        name: "Bob's Neighborhood",
      },
    });

    const newData = {
      name: 1000,
      description: [1, 2, 3],
    };

    const response = await api
      .put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData);
    expect(response.status).toBe(400);
  });

  test('Non-existent admin_id raises a 400 error', async () => {
    const neighborhoodToUpdate = await prismaClient.neighborhood.findFirst({
      where: {
        name: "Bob's Neighborhood",
      },
    });

    const newData = { admin_id: 1000 };
    const response = await api
      .put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData);

    expect(response.status).toBe(400);
    expect(await prismaClient.neighborhood.findFirst({
      where: { id: neighborhoodToUpdate!.id },
    })).toEqual({
      ...neighborhoodToUpdate,
    });
  });

  test('Non-existent neighborhood id raises a 404 error', async () => {
    const NON_EXISTENT_ID = 399495;
    const newData = { name: 'Test' };
    const response = await api
      .put(`/api/neighborhoods/${NON_EXISTENT_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData);

    expect(response.status).toBe(404);
  });
});
