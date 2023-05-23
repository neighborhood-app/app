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

const ANTONINA_LOGIN_DATA: LoginData = {
  username: 'antonina',
  password: 'secret',
};

const BOBS_NHOOD_ID = 1;
const ANTONINAS_NHOOD_ID = 2;

const loginUser = async (loginData: LoginData) => {
  const loginResponse = await api
    .post('/api/login')
    .send(loginData);

  return loginResponse;
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

  test('GET /neighborhoods/id existing id returns single neignborhood', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const neighborhood = await prismaClient.neighborhood.findFirst({
      where: { name: "Bob's Neighborhood" },
      include: {
        admin: true,
        users: true,
        requests: true,
      },
    });
    const id = neighborhood?.id;
    const response = await api.get(`/api/neighborhoods/${id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(id);
    expect(response.body).toHaveProperty('admin');
    expect(response.body).toHaveProperty('users');
    expect(response.body).toHaveProperty('requests');
  });

  test('GET /neighborhoods/id invalid id returns expected error', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const response = await api.get('/api/neighborhoods/0').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(404);
    expect(response.body.error).toEqual('No Neighborhood found');
  });

  test('GET /neighborhoods/id only returns the id, name, description and location of neighborhood if user is not logged in', async () => {
    const neighborhood = await prismaClient.neighborhood.findFirst({
      where: { name: "Bob's Neighborhood" },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
      },
    });
    const id = neighborhood?.id;
    const response = await api.get(`/api/neighborhoods/${id}`);

    const neighborhoodFromDBKeys = Object.keys(neighborhood as Neighborhood);
    const neighborhoodFromResponseKeys = Object.keys(response.body);

    expect(response.status).toEqual(200);
    expect(neighborhoodFromResponseKeys.length).toEqual(neighborhoodFromDBKeys.length);
    expect(neighborhoodFromResponseKeys).toEqual(neighborhoodFromDBKeys);
  });

  test('GET /neighborhoods/id only returns the id, name, description and location of neighborhood if is logged in but not a member', async () => {
    const loginResponse = await loginUser(ANTONINA_LOGIN_DATA);
    const { token } = loginResponse.body;

    const neighborhood = await prismaClient.neighborhood.findFirst({
      where: { name: "Bob's Neighborhood" },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
      },
    });
    const id = neighborhood?.id;
    const response = await api.get(`/api/neighborhoods/${id}`).set('Authorization', `Bearer ${token}`);

    const neighborhoodFromDBKeys = Object.keys(neighborhood as object);
    const neighborhoodFromResponseKeys = Object.keys(response.body);

    expect(response.status).toEqual(400);
    expect(neighborhoodFromResponseKeys.length).toEqual(neighborhoodFromDBKeys.length);
    expect(neighborhoodFromResponseKeys).toEqual(neighborhoodFromDBKeys);
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
      .send(BOBS_LOGIN_DATA);

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

describe('Testing user JOIN neighborhood at POST /api/neighborhood/:id/join', () => {
  // We are testing to join Bob to Antonina's Neighborhood
  beforeEach(async () => {
    await seed();
  });

  test('able to join user to neighborhood with valid data', async () => {
    // we are trying to join Bob to Antonina's neighborhood
    const initialUsers = await testHelpers.getUsersAssociatedWithNeighborhood(ANTONINAS_NHOOD_ID);
    const numInitialUsers = initialUsers?.length as number; // We are passing a valid n_hood id

    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    await api.post(`/api/neighborhoods/${ANTONINAS_NHOOD_ID}/join`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const finalUsersInDb = await testHelpers.getUsersAssociatedWithNeighborhood(ANTONINAS_NHOOD_ID);
    expect(finalUsersInDb?.length).toBe(numInitialUsers + 1);

    const finalUserNamesInDb = finalUsersInDb?.map(u => u.user_name);
    expect(finalUserNamesInDb).toContain(BOBS_LOGIN_DATA.username);
  });

  test('when user not logged in, error occurs', async () => {
    const initialUsers = await testHelpers.getUsersAssociatedWithNeighborhood(ANTONINAS_NHOOD_ID);

    const joinResponse = await api.post(`/api/neighborhoods/${ANTONINAS_NHOOD_ID}/join`);

    expect(joinResponse.status).toEqual(401);

    const finalUsers = await testHelpers.getUsersAssociatedWithNeighborhood(ANTONINAS_NHOOD_ID);

    expect(finalUsers?.length).toBe(initialUsers?.length);
  });

  test('when user logged in and invalid url, error occurs', async () => {
    const initialUsers = await testHelpers.getUsersAssociatedWithNeighborhood(ANTONINAS_NHOOD_ID);

    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    await api.post('/api/neighborhoods/xyz/join')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const finalUsers = await testHelpers.getUsersAssociatedWithNeighborhood(ANTONINAS_NHOOD_ID);

    expect(finalUsers?.length).toBe(initialUsers?.length);
  });

  test('when user logged in and invalid neighborhood, error occurs', async () => {
    const initialUsers = await testHelpers.getUsersAssociatedWithNeighborhood(ANTONINAS_NHOOD_ID);

    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const INVALID_NHOOD_ID = 100000;
    await api.post(`/api/neighborhoods/${INVALID_NHOOD_ID}/join`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const finalUsers = await testHelpers.getUsersAssociatedWithNeighborhood(ANTONINAS_NHOOD_ID);

    expect(finalUsers?.length).toBe(initialUsers?.length);
  });

  test('when user logged in and user already added to the neighborhood, error occurs', async () => {
    // we are trying to add Bob to Bob's neighborhood
    const initialUsers = await testHelpers.getUsersAssociatedWithNeighborhood(BOBS_NHOOD_ID);

    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    await api.post(`/api/neighborhoods/${BOBS_NHOOD_ID}/join`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const finalUsers = await testHelpers.getUsersAssociatedWithNeighborhood(BOBS_NHOOD_ID);

    expect(finalUsers?.length).toBe(initialUsers?.length);
  });
});
