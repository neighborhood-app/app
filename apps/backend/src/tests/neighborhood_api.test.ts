/* eslint-disable no-underscore-dangle */ // Need to access response._body
import { Neighborhood, User } from '@prisma/client';
import { Response } from 'supertest';
import app from '../app';
import prismaClient from '../../prismaClient';
import seed from './seed';
import testHelpers from './testHelpers';
import {
  LoginData, NeighborhoodDetailsForNonMembers, NeighborhoodDetailsForMembers, UpdateRequestData,
} from '../types';

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

const MIKES_LOGIN_DATA: LoginData = {
  username: 'mike',
  password: 'secret',
};

const BOBS_NHOOD_ID = 1;
const BOBS_USER_ID = 1;
const ANTONINAS_NHOOD_ID = 2;
const MIKES_REQUEST_ID = 1;
const MIKES_USER_ID = 5;
const MIKES_REQUEST_TITLE = 'Help moving furniture in apartment';
const INVALID_NHOOD_ID = 12345;

const loginUser = async (loginData: LoginData): Promise<Response> => {
  const loginResponse = await api
    .post('/api/login')
    .send(loginData);

  return loginResponse;
};

beforeAll(async () => {
  await testHelpers.removeAllData();
});

describe('Tests for getting all neighborhoods: GET /neighborhoods', () => {
  beforeAll(async () => {
    await seed();
  });

  test('GET /neighborhoods returns all neighborhoods', async () => {
    // Seeds the database to have existing neighborhoods to check.
    const neighborhoods = await testHelpers.neighborhoodsInDb();
    const numberOfNeighborhoods = neighborhoods.length;
    const response: Response = await api.get('/api/neighborhoods');
    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(numberOfNeighborhoods);
  });

  test('GET /neighborhoods returns 200 even if no neighborhoods were created', async () => {
    await testHelpers.removeAllData();
    const response: Response = await api.get('/api/neighborhoods');
    expect(response.status).toEqual(200);
    expect(response.body.length).toBe(0);
  });
});

describe('Tests for getting a single neighborhood: GET /neighborhoods/:id', () => {
  beforeAll(async () => {
    await seed();
  });

  test('GET /neighborhoods/:id existing id returns single neighborhood', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const neighborhood: NeighborhoodDetailsForMembers | null = await prismaClient
      .neighborhood.findFirst({
        where: { name: "Bob's Neighborhood" },
        include: {
          admin: true,
          users: true,
          requests: true,
        },
      });
    const id = neighborhood?.id;
    const response: Response = await api.get(`/api/neighborhoods/${id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(id);
    expect(response.body).toHaveProperty('admin');
    expect(response.body).toHaveProperty('users');
    expect(response.body).toHaveProperty('requests');
  });

  test('GET /neighborhoods/:id invalid id returns expected error', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const response: Response = await api.get('/api/neighborhoods/0').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(404);
    expect(response.body.error).toEqual('No Neighborhood found');
  });

  test('GET /neighborhoods/:id only returns the id, name, description and location of neighborhood if user is not logged in', async () => {
    const neighborhood: NeighborhoodDetailsForNonMembers | null = await prismaClient
      .neighborhood.findFirst({
        where: { name: "Bob's Neighborhood" },
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
        },
      });
    const id = neighborhood?.id;
    const response: Response = await api.get(`/api/neighborhoods/${id}`);

    const neighborhoodFromDBKeys = Object.keys(neighborhood as Neighborhood);
    const neighborhoodFromResponseKeys = Object.keys(response.body);

    expect(response.status).toEqual(200);
    expect(neighborhoodFromResponseKeys.length).toEqual(neighborhoodFromDBKeys.length);
    expect(neighborhoodFromResponseKeys).toEqual(neighborhoodFromDBKeys);
  });

  test('GET /neighborhoods/id only returns the id, name, description and location of neighborhood if is logged in but not a member', async () => {
    const loginResponse = await loginUser(ANTONINA_LOGIN_DATA);
    const { token } = loginResponse.body;

    const neighborhood: NeighborhoodDetailsForNonMembers | null = await prismaClient
      .neighborhood.findFirst({
        where: { name: "Bob's Neighborhood" },
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
        },
      });
    const id = neighborhood?.id;
    const response: Response = await api.get(`/api/neighborhoods/${id}`).set('Authorization', `Bearer ${token}`);

    const neighborhoodFromDBKeys = Object.keys(neighborhood as object);
    const neighborhoodFromResponseKeys = Object.keys(response.body);

    expect(response.status).toEqual(200);
    expect(neighborhoodFromResponseKeys.length).toEqual(neighborhoodFromDBKeys.length);
    expect(neighborhoodFromResponseKeys).toEqual(neighborhoodFromDBKeys);
  });
});

describe('Tests for creating a single neighborhood: POST /neighborhoods/:id ', () => {
  let initialNeighborhoods: Array<Neighborhood>;
  let numInitialNeighborhoods: number;

  beforeAll(async () => {
    await seed();
  });

  beforeEach(async () => {
    initialNeighborhoods = await testHelpers.neighborhoodsInDb();
    numInitialNeighborhoods = initialNeighborhoods.length;
  });

  // This test case failed once - adding logs to track down the bug
  // error was 'socket hang up'
  test('when user not logged in, unable to create neighborhood', async () => {
    const postResponse: Response = await api.post('/api/neighborhoods');
    console.log(postResponse?.body);

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;
    console.log(currentNeighborhoods);

    expect(postResponse.status).toEqual(401);
    expect(numCurrentNeighborhoods).toEqual(numInitialNeighborhoods);
  });

  test('when user logged in, able to create neighborhood with valid data', async () => {
    const bobUser: User | null = await prismaClient.user.findUnique({
      where: {
        user_name: BOBS_LOGIN_DATA.username,
      },
    });

    const bobUserId: number | undefined = bobUser?.id;

    const loginResponse: Response = await api
      .post('/api/login')
      .send(BOBS_LOGIN_DATA);

    const { token } = loginResponse.body;

    const NEW_NEIGHBORHOOD_NAME = 'new-neighborhood';

    const createNeighborhoodResponse: Response = await api.post('/api/neighborhoods')
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
    const loginResponse: Response = await api
      .post('/api/login')
      .send(BOBS_LOGIN_DATA);

    const { token } = loginResponse.body;

    const NEW_NEIGHBORHOOD_NAME = 'new'; // invalid because shorter than 4 characters

    const createResponse: Response = await api.post('/api/neighborhoods')
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
    const loginResponse: Response = await api
      .post('/api/login')
      .send(BOBS_LOGIN_DATA);

    const { token } = loginResponse.body;

    const existingNeighborhoodName = initialNeighborhoods[0].name;

    const createResponse: Response = await api.post('/api/neighborhoods')
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

describe('Tests for deleting a single neighborhood: DELETE /neighborhoods/:id', () => {
  let initialNeighborhoods: Array<Neighborhood>;
  let numInitialNeighborhoods: number;
  let token: string;

  beforeAll(async () => {
    const loginResponse: Response = await api
      .post('/api/login')
      .send(BOBS_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  beforeEach(async () => {
    await seed();
    initialNeighborhoods = await testHelpers.neighborhoodsInDb();
    numInitialNeighborhoods = initialNeighborhoods.length;
  });

  test('DELETE /neighborhoods/:id removes a neighborhood', async () => {
    // 1 is valid neighborhood id for BOBS_LOGIN_DATA
    const deleteResponse: Response = await api
      .delete('/api/neighborhoods/1')
      .set('Authorization', `Bearer ${token}`);

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(deleteResponse.status).toEqual(200);
    expect(numCurrentNeighborhoods).toEqual(numInitialNeighborhoods - 1);
  });

  test('DELETE /neighborhoods/:id with invalid id returns appropriate error', async () => {
    // 1234 is invalid neighborhood id for BOBS_LOGIN_DATA
    const deleteResponse: Response = await api.delete('/api/neighborhoods/1234')
      .set('Authorization', `Bearer ${token}`);

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(deleteResponse.status).toEqual(404);
    expect(numCurrentNeighborhoods).toEqual(numInitialNeighborhoods);
  });

  test('User cannot delete neighborhood if user is not admin', async () => {
    // 2 is invalid neighborhood id for BOBS_LOGIN_DATA with bob as admin
    const deleteResponse: Response = await api.delete('/api/neighborhoods/2').set('Authorization', `Bearer ${token}`);

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(deleteResponse.status).toEqual(403);
    expect(numCurrentNeighborhoods).toEqual(numInitialNeighborhoods);
  });

  test('User cannot delete neighborhood if user is not logged in', async () => {
    const deleteResponse: Response = await api.delete('/api/neighborhoods/1');

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(deleteResponse.status).toEqual(401);
    expect(numInitialNeighborhoods).toEqual(numCurrentNeighborhoods);
  });
});

describe('Tests for updating a single neighborhood: PUT /neighborhoods/:id', () => {
  let token: string;

  beforeAll(async () => {
    const loginResponse: Response = await api
      .post('/api/login')
      .send(BOBS_LOGIN_DATA);

    token = loginResponse.body.token;
  });

  beforeEach(async () => {
    await seed();
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

    const response: Response = await api
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
    const response: Response = await api
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

    const response: Response = await api
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
    const updateResponse: Response = await api
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

    const updateResponse: Response = await api
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

    const response: Response = await api
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

    const response: Response = await api
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
    const response: Response = await api
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
    const response: Response = await api
      .put(`/api/neighborhoods/${NON_EXISTENT_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData);

    expect(response.status).toBe(404);
  });
});

describe('Tests for user joining a neighborhood: POST /neighborhood/:id/join', () => {
  // We are testing to join the user Bob to Antonina's Neighborhood
  let token: string;

  beforeAll(async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  beforeEach(async () => {
    await seed();
  });

  test('able to join user to neighborhood with valid data', async () => {
    // we are trying to join Bob to Antonina's neighborhood
    const initialUsers = await testHelpers.getUsersAssociatedWithNeighborhood(ANTONINAS_NHOOD_ID);
    const numInitialUsers = initialUsers?.length as number; // We are passing a valid n_hood id

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

  test('when user logged in and invalid neighborhood ID, error occurs', async () => {
    const initialUsers = await testHelpers.getUsersAssociatedWithNeighborhood(ANTONINAS_NHOOD_ID);

    await api.post('/api/neighborhoods/xyz/join')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const finalUsers = await testHelpers.getUsersAssociatedWithNeighborhood(ANTONINAS_NHOOD_ID);

    expect(finalUsers?.length).toBe(initialUsers?.length);
  });

  test('when user logged in and non-existend neighborhood ID, error occurs', async () => {
    const initialUsers = await testHelpers.getUsersAssociatedWithNeighborhood(ANTONINAS_NHOOD_ID);
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

    await api.post(`/api/neighborhoods/${BOBS_NHOOD_ID}/join`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const finalUsers = await testHelpers.getUsersAssociatedWithNeighborhood(BOBS_NHOOD_ID);

    expect(finalUsers?.length).toBe(initialUsers?.length);
  });
});

describe('Tests for getting requests associated with a n-hood GET /neighborhoods/:id/requests', () => {
  beforeAll(async () => {
    await seed();
  });

  test('unable to fetch data when user no token present', async () => {
    const response: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests`);

    expect(response.status).toEqual(401);
    expect(response.body.error).toBe('user not signed in');
  });

  test('unable to fetch data when token invalid', async () => {
    const response: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests`)
      .set('Authorization', 'invalid-token');

    expect(response.status).toEqual(401);
    expect(response.body.error).toBe('user not signed in');
  });

  test('unable to fetch data when user not a member of neighborhood', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const response: Response = await api
      .get(`/api/neighborhoods/${ANTONINAS_NHOOD_ID}/requests`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual('user is not a member of the neighborhood');
  });

  test('able to fetch data with valid data', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const requestsWithNeighborhoodInDb = await testHelpers
      .getRequestsAssociatedWithNeighborhood(BOBS_NHOOD_ID);

    const response: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBe(requestsWithNeighborhoodInDb.length);
    expect(response.body[0].neighborhood_id).toBe(BOBS_NHOOD_ID);
  });
});

describe('Test for getting a single request at GET /neighborhoods/:id/requests/:id', () => {
  beforeAll(async () => {
    await seed();
  });

  test('GET /neighborhoods/:nId/requests/:rId fails when no authorization header present', async () => {
    const getResponse: Response = await api.get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`);

    expect(getResponse.status).toEqual(401);
    expect(getResponse.body.error).toEqual('user not signed in');
  });

  test('GET /neighborhoods/:nId/requests/:rId/ fails when user not a member of neighborhood', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const getResponse: Response = await api
      .get(`/api/neighborhoods/${ANTONINAS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).toEqual(401);
    expect(getResponse.body.error).toEqual('user not a member of neighborhood');
  });

  test('GET /neighborhood/:nId/requests/:rId fails when neighborhoodId invalid', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const getResponse: Response = await api
      .get(`/api/neighborhoods/foo/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).toEqual(400);
  });

  test('GET /neighborhood/:nId/requests/:rId fails when request is not associated with nhood', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const NOT_MIKES_REQUEST_ID = 2;
    const getResponse: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${NOT_MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).toEqual(400);
    expect(getResponse.body.error).toEqual('request not associated with the neighborhood');
  });

  test('GET /neighborhoods/:nId/requests/:rId/ fails works with valid data', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const getResponse: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).toEqual(200);
    expect(getResponse.body.user_id).toBe(MIKES_USER_ID);
    expect(getResponse.body.title).toBe(MIKES_REQUEST_TITLE);
  });
});

describe('Tests for creating a new request at POST /requests', () => {
  beforeEach(async () => {
    await seed();
  });

  test('POST /:nId/requests fails when no token exists', async () => {
    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const postResponse: Response = await api.post(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests`);

    const numberOfFinalRequests = await testHelpers.getNumberOfRequests();

    expect(postResponse.status).toEqual(401);
    expect(postResponse.body.error).toEqual('user not signed in');

    expect(numberOfInitialRequests).toEqual(numberOfFinalRequests);
  });

  test('POST /:nId/requests fails when token invalid', async () => {
    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const postResponse: Response = await api
      .post(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests`)
      .set('Authorization', 'WrongToken');

    const numberOfFinalRequests = await testHelpers.getNumberOfRequests();

    expect(postResponse.status).toEqual(401);
    expect(postResponse.body.error).toEqual('user not signed in');
    expect(numberOfInitialRequests).toEqual(numberOfFinalRequests);
  });

  test('POST /:nId/requests fails when data missing', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    // no content
    const response1 = await api
      .post(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'foo' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    let numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response1.body.error).toEqual('title or content missing or invalid');

    // no title
    const response2 = await api
      .post(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests`)
      .set('Authorization', `Bearer ${token}`)
      .send({ neighborhood_id: BOBS_NHOOD_ID, content: 'foo' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
    expect(response2.body.error).toEqual('title or content missing or invalid');
  });

  test('POST /:nId/requests fails when neighborhood does not exist', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const response = await api
      .post(`/api/neighborhoods/${INVALID_NHOOD_ID}/requests`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'foofoo', content: 'barbar' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const numberOfFinalRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfFinalRequests).toEqual(numberOfInitialRequests);
    expect(response.body.error).toBe('Neighborhood does not exist');
  });

  test('POST /request fails when content invalid', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const INVALID_TITLE = 'foo';
    const response = await api
      .post(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: INVALID_TITLE, content: 'barbar' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const numberOfFinalRequests = await testHelpers.getNumberOfRequests();
    expect(numberOfFinalRequests).toEqual(numberOfInitialRequests);
    expect(response.body.error).toBe('Invalid title');
  });

  test('POST /request fails when user not a member of the neighborhood', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

    const response = await api
      .post(`/api/neighborhoods/${ANTONINAS_NHOOD_ID}/requests`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'foofoo', content: 'barbar' })
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
      .post(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'foofoo', content: 'barbar' })
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

describe('Tests for updating a request: PUT /neighborhoods/:nId/requests/:rId', () => {
  let token: string;

  beforeAll(async () => {
    await seed();

    const loginResponse: Response = await loginUser(MIKES_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  afterEach(async () => {
    await seed();
  });

  test('Update a request\'s title, content and status fields', async () => {
    const newData: UpdateRequestData = {
      title: 'Test',
      content: 'Test',
      status: 'CLOSED',
    };

    const response: Response = await api
      .put(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
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
      .put(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
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
      .put(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
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
      .put(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
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
      .put(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
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
      .put(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
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
      .put(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    const request: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(request?.body).toEqual(requestBeforeUpdate?.body);
  });
});

describe('Tests for deleting a request: DELETE /neighborhoods/:nId/requests/:rId', () => {
  let token: string;

  beforeAll(async () => {
    await seed();

    const loginResponse: Response = await loginUser(MIKES_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  afterEach(async () => {
    await seed();
  });

  test('Delete an existing request', async () => {
    const response: Response = await api
      .delete(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    const deleted = await prismaClient.request.findUnique({
      where: { id: MIKES_REQUEST_ID },
    });

    expect(response.status).toEqual(204);
    expect(deleted).toBe(null);
  });

  test('User cannot delete request if not its creator', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const bobToken: string = loginResponse.body.token;

    const response: Response = await api
      .delete(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${bobToken}`);

    const request = await prismaClient.request.findUnique({
      where: { id: MIKES_REQUEST_ID },
    });

    expect(response.status).toEqual(401);
    expect(request).not.toBe(null);
  });

  test('Delete non-existent request fails', async () => {
    const NON_EXISTENT_ID = 100;
    const response: Response = await api
      .delete(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${NON_EXISTENT_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No Request found');
  });

  test('Wrong neighborhoodId fails the deletion', async () => {
    const response: Response = await api
      .delete(`/api/neighborhoods/${INVALID_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No Request found');
  });

  test('User cannot delete request if they aren\'t logged in', async () => {
    const response: Response = await api
      .delete(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests/${MIKES_REQUEST_ID}`);

    const request = await prismaClient.request.findUnique({
      where: { id: MIKES_REQUEST_ID },
    });

    expect(response.status).toEqual(401);
    expect(response.body.error).toBe('user not signed in');
    expect(request).not.toBe(null);
  });
});
