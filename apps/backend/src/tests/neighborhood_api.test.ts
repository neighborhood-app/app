/* eslint-disable no-underscore-dangle */ // Need to access response._body
import { Response } from 'supertest';
import app from '../app';
import prismaClient from '../../prismaClient';
import seed from './seed';
import testHelpers from './testHelpers';
import {
  Neighborhood,
  User,
  LoginData,
  NeighborhoodDetailsForNonMembers,
  NeighborhoodDetailsForMembers,
  NeighborhoodsPerPage,
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

const RADU_LOGIN_DATA: LoginData = {
  username: 'radu',
  password: 'secret',
};

const BOBS_NHOOD_ID = 1;
const ANTONINAS_NHOOD_ID = 2;
const NONEXISTENT_NHOOD_ID = 12345;

const loginUser = async (loginData: LoginData): Promise<Response> => {
  const loginResponse = await api.post('/api/login').send(loginData);

  return loginResponse;
};

describe('Tests for getting all neighborhoods: GET /neighborhoods', () => {
  let token: string;
  beforeAll(async () => {
    await seed();
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  test('Cannot access neighborhoods without log-in token', async () => {
    const response: Response = await api.get('/api/neighborhoods');

    expect(response.status).toEqual(401);
    expect(response.body.error).toBe('You must be signed in to do that.');
  });

  test('/:cursor returns first batch of 17 neighborhoods', async () => {
    const response: Response = await api
      .get('/api/neighborhoods')
      .set('Authorization', `Bearer ${token}`);

    const nhoodData: NeighborhoodsPerPage = response.body;
    expect(response.status).toEqual(200);
    expect(nhoodData.neighborhoods.length).toBeLessThanOrEqual(17);
  });

  test('/:cursor returns neighborhoods, and next cursor and next page metadata', async () => {
    const neighborhoods: Neighborhood[] = await testHelpers.neighborhoodsInDb();
    const hasNextPage = neighborhoods.length > 17;

    const response: Response = await api
      .get('/api/neighborhoods')
      .set('Authorization', `Bearer ${token}`);

    const nhoodData: NeighborhoodsPerPage = response.body;
    const lastNhoodId: number | undefined = nhoodData.neighborhoods.slice(-1)[0]?.id;
    expect(response.status).toEqual(200);
    expect(nhoodData.neighborhoods.length).toBeLessThanOrEqual(17);
    expect(nhoodData.newCursor).toBe(hasNextPage ? lastNhoodId : undefined);
    expect(nhoodData.hasNextPage).toBe(hasNextPage);
  });

  test('/:cursor throws error if cursor is out of bounds', async () => {
    const neighborhoods: Neighborhood[] = await testHelpers.neighborhoodsInDb();
    const firstNhoodId: number | undefined = neighborhoods[0]?.id;
    const lastNhoodId: number | undefined = neighborhoods.slice(-1)[0]?.id;
    const leftOutOfBoundCursor = firstNhoodId ? firstNhoodId - 1 : 0;
    const rightOutOfBoundCursor = lastNhoodId ? lastNhoodId + 1 : 1;

    const res1: Response = await api
      .get(`/api/neighborhoods/${rightOutOfBoundCursor}`)
      .set('Authorization', `Bearer ${token}`);

    const res2: Response = await api
      .get(`/api/neighborhoods/${leftOutOfBoundCursor}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res1.status).toEqual(404);
    expect(res1.body).toEqual({ error: 'No Neighborhood found' });

    expect(res2.status).toEqual(404);
    expect(res2.body).toEqual({ error: 'No Neighborhood found' });
  });

  test('/?searchTerm=:searchTerm returns neighborhoods that match the search term', async () => {
    const searchTerm = 'hood';
    const neighborhoods: Neighborhood[] = await testHelpers.neighborhoodsInDb();
    const filteredNhoods = neighborhoods.filter((nhood) => nhood.name.includes(searchTerm));

    const response: Response = await api
      .get(`/api/neighborhoods/`)
      .query({ searchTerm })
      .set('Authorization', `Bearer ${token}`);

    const resNhoods: Neighborhood[] = response.body;
    expect(response.status).toEqual(200);
    expect(resNhoods.length).toBe(filteredNhoods.length);
    expect(resNhoods.every((nhood) => nhood.name.includes(searchTerm))).toBe(true);
  });

  test('/?searchTerm=:searchTerm returns empty array if no neighborhoods match the search term', async () => {
    const searchTerm = 'xksksjfjf';
    const neighborhoods: Neighborhood[] = await testHelpers.neighborhoodsInDb();
    const nhoodMatch = neighborhoods.find((nhood) => nhood.name.includes(searchTerm));

    expect(nhoodMatch).toBeUndefined();

    const response: Response = await api
      .get(`/api/neighborhoods/`)
      .query({ searchTerm })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body.length).toBe(0);
  });

  // TODO: have to test this with more seed data
  test('/?searchTerm=:searchTerm match is case-insensitive', async () => {
    const searchTerm = 'HoOd';
    const neighborhoods: Neighborhood[] = await testHelpers.neighborhoodsInDb();
    const filteredNhoods = neighborhoods.filter((nhood) =>
      nhood.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const response: Response = await api
      .get(`/api/neighborhoods/`)
      .query({ searchTerm })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body.length).toBe(filteredNhoods.length);
  });

  // TODO: have to test this with more seed data
  test('/?searchTerm=:searchTerm returns all neighborhoods if the search term is an empty string', async () => {
    const searchTerm = '';
    const neighborhoods: Neighborhood[] = await testHelpers.neighborhoodsInDb();

    const response: Response = await api
      .get(`/api/neighborhoods/`)
      .query({ searchTerm })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body.length).toBe(neighborhoods.length);
  });

  test('GET /neighborhoods returns 200 even if no neighborhoods exist', async () => {
    await testHelpers.removeAllData();
    const response: Response = await api
      .get('/api/neighborhoods')
      .set('Authorization', `Bearer ${token}`);

    const nhoodData: NeighborhoodsPerPage = response.body;
    expect(response.status).toEqual(200);
    expect(nhoodData.neighborhoods.length).toBe(0);
    expect(nhoodData.hasNextPage).toBe(false);
    expect(nhoodData.newCursor).toBeUndefined();
  });
});

describe('Tests for getting a single neighborhood: GET /neighborhoods/:id', () => {
  beforeAll(async () => {
    await seed();
  });

  test('GET /neighborhoods/:id existing id returns single neighborhood', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const neighborhood: NeighborhoodDetailsForMembers | null =
      await prismaClient.neighborhood.findFirst({
        where: { name: "Bob's Neighborhood" },
        include: {
          admin: true,
          users: true,
          requests: true,
        },
      });
    const id = neighborhood?.id;
    const response: Response = await api
      .get(`/api/neighborhoods/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(id);
    expect(response.body).toHaveProperty('admin');
    expect(response.body).toHaveProperty('users');
    expect(response.body).toHaveProperty('requests');
  });

  test('GET /neighborhoods/:id invalid id returns expected error', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const { token } = loginResponse.body;

    const response: Response = await api
      .get('/api/neighborhoods/0')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(404);
    expect(response.body.error).toEqual('No Neighborhood found');
  });

  test('GET /neighborhoods/:id only returns the id, name, description and location of neighborhood if user is not logged in', async () => {
    const neighborhood: NeighborhoodDetailsForNonMembers | null =
      await prismaClient.neighborhood.findFirst({
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
    const loginResponse = await loginUser(RADU_LOGIN_DATA);
    const { token } = loginResponse.body;

    const neighborhood: NeighborhoodDetailsForNonMembers | null =
      await prismaClient.neighborhood.findFirst({
        where: { name: "Bob's Neighborhood" },
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
        },
      });
    const id = neighborhood?.id;
    const response: Response = await api
      .get(`/api/neighborhoods/${id}`)
      .set('Authorization', `Bearer ${token}`);

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
    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(postResponse.status).toEqual(401);
    expect(numCurrentNeighborhoods).toEqual(numInitialNeighborhoods);
  });

  test('when user logged in, able to create neighborhood with valid data', async () => {
    const bobUser: User | null = await prismaClient.user.findUnique({
      where: {
        username: BOBS_LOGIN_DATA.username,
      },
    });

    const bobUserId: number | undefined = bobUser?.id;

    const loginResponse: Response = await api.post('/api/login').send(BOBS_LOGIN_DATA);

    const { token } = loginResponse.body;

    const NEW_NEIGHBORHOOD_NAME = 'new-neighborhood';

    const createNeighborhoodResponse: Response = await api
      .post('/api/neighborhoods')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: NEW_NEIGHBORHOOD_NAME, description: '', location: '' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const neighborhoodUsers = createNeighborhoodResponse.body.users;

    const userNames = neighborhoodUsers.map((u: { username: any }) => u.username);
    expect(userNames).toContain(BOBS_LOGIN_DATA.username);

    expect(createNeighborhoodResponse.body.name).toBe(NEW_NEIGHBORHOOD_NAME);
    expect(createNeighborhoodResponse.body.admin_id).toBe(bobUserId);

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(numCurrentNeighborhoods).toBe(numInitialNeighborhoods + 1);

    const currentNeighborhoodNames = currentNeighborhoods.map((n) => n.name);
    expect(currentNeighborhoodNames).toContain(NEW_NEIGHBORHOOD_NAME);
  });

  test('when user logged in, unable to create neighborhood with invalid neighborhood name', async () => {
    const loginResponse: Response = await api.post('/api/login').send(BOBS_LOGIN_DATA);

    const { token } = loginResponse.body;

    const NEW_NEIGHBORHOOD_NAME = 'new'; // invalid because shorter than 4 characters

    const createResponse: Response = await api
      .post('/api/neighborhoods')
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
    const loginResponse: Response = await api.post('/api/login').send(BOBS_LOGIN_DATA);

    const { token } = loginResponse.body;

    const existingNeighborhoodName = initialNeighborhoods[0].name;

    const createResponse: Response = await api
      .post('/api/neighborhoods')
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
    const loginResponse: Response = await api.post('/api/login').send(BOBS_LOGIN_DATA);
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
    const deleteResponse: Response = await api
      .delete('/api/neighborhoods/1234')
      .set('Authorization', `Bearer ${token}`);

    const currentNeighborhoods = await testHelpers.neighborhoodsInDb();
    const numCurrentNeighborhoods = currentNeighborhoods.length;

    expect(deleteResponse.status).toEqual(404);
    expect(numCurrentNeighborhoods).toEqual(numInitialNeighborhoods);
  });

  test('User cannot delete neighborhood if user is not admin', async () => {
    // 2 is invalid neighborhood id for BOBS_LOGIN_DATA with bob as admin
    const deleteResponse: Response = await api
      .delete('/api/neighborhoods/2')
      .set('Authorization', `Bearer ${token}`);

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
    const loginResponse: Response = await api.post('/api/login').send(BOBS_LOGIN_DATA);

    token = loginResponse.body.token;
  });

  beforeEach(async () => {
    await seed();
  });

  test("Update all of a neighborhood's fields by id", async () => {
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

    expect(response.text).toEqual("Neighborhood 'Test' has been updated.");
    expect(response.status).toEqual(200);
    expect(
      await prismaClient.neighborhood.findFirst({
        where: { id: neighborhoodToUpdate!.id },
      }),
    ).toEqual({
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

    expect(response.text).toEqual("Neighborhood 'Test' has been updated.");
    expect(response.status).toEqual(200);
    expect(
      await prismaClient.neighborhood.findFirst({
        where: { id: neighborhoodToUpdate!.id },
      }),
    ).toEqual({
      ...neighborhoodToUpdate,
      name: newData.name,
    });
  });

  test("Empty input doesn't change anything on the server", async () => {
    const neighborhoodToUpdate = await prismaClient.neighborhood.findFirst({
      where: {
        name: "Bob's Neighborhood",
      },
    });

    const response: Response = await api
      .put(`/api/neighborhoods/${neighborhoodToUpdate!.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.text).toEqual("Neighborhood 'Bob's Neighborhood' has been updated.");
    expect(response.status).toEqual(200);
    expect(
      await prismaClient.neighborhood.findFirst({
        where: { id: neighborhoodToUpdate!.id },
      }),
    ).toEqual({
      ...neighborhoodToUpdate,
    });
  });

  test("User cannot update neighborhood if they aren't admin", async () => {
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

  test("User cannot update neighborhood if they aren't logged in", async () => {
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
    expect(
      await prismaClient.neighborhood.findFirst({
        where: { id: neighborhoodToUpdate!.id },
      }),
    ).toEqual({
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
    const initialUsers = await testHelpers.getNeighborhoodUsers(ANTONINAS_NHOOD_ID);
    const numInitialUsers = initialUsers?.length as number; // We are passing a valid n_hood id

    await api
      .post(`/api/neighborhoods/${ANTONINAS_NHOOD_ID}/join`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const finalUsersInDb = await testHelpers.getNeighborhoodUsers(ANTONINAS_NHOOD_ID);
    expect(finalUsersInDb?.length).toBe(numInitialUsers + 1);

    const finalUserNamesInDb = finalUsersInDb?.map((u) => u.username);
    expect(finalUserNamesInDb).toContain(BOBS_LOGIN_DATA.username);
  });

  test('when user not logged in, error occurs', async () => {
    const initialUsers = await testHelpers.getNeighborhoodUsers(ANTONINAS_NHOOD_ID);

    const joinResponse = await api.post(`/api/neighborhoods/${ANTONINAS_NHOOD_ID}/join`);

    expect(joinResponse.status).toEqual(401);

    const finalUsers = await testHelpers.getNeighborhoodUsers(ANTONINAS_NHOOD_ID);

    expect(finalUsers?.length).toBe(initialUsers?.length);
  });

  test('when user logged in and invalid neighborhood ID, error occurs', async () => {
    const initialUsers = await testHelpers.getNeighborhoodUsers(ANTONINAS_NHOOD_ID);

    await api
      .post('/api/neighborhoods/xyz/join')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const finalUsers = await testHelpers.getNeighborhoodUsers(ANTONINAS_NHOOD_ID);

    expect(finalUsers?.length).toBe(initialUsers?.length);
  });

  test('when user logged in and non-existend neighborhood ID, error occurs', async () => {
    const initialUsers = await testHelpers.getNeighborhoodUsers(ANTONINAS_NHOOD_ID);
    await api
      .post(`/api/neighborhoods/${NONEXISTENT_NHOOD_ID}/join`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const finalUsers = await testHelpers.getNeighborhoodUsers(ANTONINAS_NHOOD_ID);
    expect(finalUsers?.length).toBe(initialUsers?.length);
  });

  test('when user logged in and user already added to the neighborhood, error occurs', async () => {
    // we are trying to add Bob to Bob's neighborhood
    const initialUsers = await testHelpers.getNeighborhoodUsers(BOBS_NHOOD_ID);

    await api
      .post(`/api/neighborhoods/${BOBS_NHOOD_ID}/join`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const finalUsers = await testHelpers.getNeighborhoodUsers(BOBS_NHOOD_ID);

    expect(finalUsers?.length).toBe(initialUsers?.length);
  });
});

describe('Tests for user leaving a neighborhood: PUT /neighborhood/:id/leave', () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    const loginResponse = await loginUser(RADU_LOGIN_DATA);
    token = loginResponse.body.token;
    userId = loginResponse.body.id;
  });

  beforeEach(async () => {
    await seed();
  });

  test('User can leave neighborhood with valid data', async () => {
    const initialUsers = await testHelpers.getNeighborhoodUsers(ANTONINAS_NHOOD_ID);
    const numInitialUsers = initialUsers?.length as number;

    await api
      .put(`/api/neighborhoods/${ANTONINAS_NHOOD_ID}/leave`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const finalUsersInNeighborhood = await testHelpers.getNeighborhoodUsers(ANTONINAS_NHOOD_ID);
    const usernameInNeighborhood = finalUsersInNeighborhood
      ?.map((user) => user.username)
      .includes(RADU_LOGIN_DATA.username);

    expect(finalUsersInNeighborhood?.length).toBe(numInitialUsers - 1);
    expect(usernameInNeighborhood).toBe(false);

    const neighborhoodReqs = await testHelpers.getNeighborhoodRequests(ANTONINAS_NHOOD_ID);
    const deactivatedRequests = neighborhoodReqs
      .filter((req) => req.user_id === userId)
      .every((req) => req.status === 'CLOSED' || req.status === 'INACTIVE');

    const requestsIds = neighborhoodReqs.map((req) => req.id);
    const userResponses = await testHelpers.getUserResponses(userId);
    const deactivatedResponses = userResponses
      ?.filter((res) => requestsIds.includes(res.request_id))
      .every((res) => res.status === 'INACTIVE');

    expect(deactivatedRequests).toBe(true);
    expect(deactivatedResponses).toBe(true);
  });

  test('If user is neighborhood admin, the neighborhood is deleted', async () => {
    const loginData = await loginUser(ANTONINA_LOGIN_DATA);
    const antoninaToken = loginData.body.token;
    const neighborhoodRequestIds = (
      await testHelpers.getNeighborhoodRequests(ANTONINAS_NHOOD_ID)
    ).map((req) => req.id);

    await api
      .put(`/api/neighborhoods/${ANTONINAS_NHOOD_ID}/leave`)
      .set('Authorization', `Bearer ${antoninaToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const antoninaNeighborhood = await testHelpers.getNeighborhoodById(ANTONINAS_NHOOD_ID);
    const neighborhoodReqs = await testHelpers.getNeighborhoodRequests(ANTONINAS_NHOOD_ID);
    const neighborhoodResponses = (await testHelpers.getResponses()).filter((res) =>
      neighborhoodRequestIds.includes(res.request_id),
    );

    expect(antoninaNeighborhood).toBe(null);
    expect(neighborhoodReqs.length).toBe(0);
    expect(neighborhoodResponses.length).toBe(0);
  });

  test("User can't leave neighborhood without being logged-in", async () => {
    const initialUsers = await testHelpers.getNeighborhoodUsers(ANTONINAS_NHOOD_ID);
    const numInitialUsers = initialUsers?.length as number;

    await api
      .put(`/api/neighborhoods/${ANTONINAS_NHOOD_ID}/leave`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const finalUsersInNeighborhood = await testHelpers.getNeighborhoodUsers(ANTONINAS_NHOOD_ID);
    expect(finalUsersInNeighborhood?.length).toBe(numInitialUsers);
  });

  test("User can't leave neighborhood they're not a member of", async () => {
    const initialUsers = await testHelpers.getNeighborhoodUsers(BOBS_NHOOD_ID);
    const numInitialUsers = initialUsers?.length as number;

    await api
      .put(`/api/neighborhoods/${BOBS_NHOOD_ID}/leave`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const finalUsersInNeighborhood = await testHelpers.getNeighborhoodUsers(BOBS_NHOOD_ID);
    expect(finalUsersInNeighborhood?.length).toBe(numInitialUsers);
  });

  test('Non-existent neighborhood id raises an error', async () => {
    await api
      .put(`/api/neighborhoods/${NONEXISTENT_NHOOD_ID}/leave`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .expect('Content-Type', /application\/json/);
  });

  test('Invalid neighborhood id raises an error', async () => {
    await api
      .put('/api/neighborhoods/xyz/leave')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

describe('Tests for getting requests associated with a n-hood GET /neighborhoods/:id/requests', () => {
  beforeAll(async () => {
    await seed();
  });

  test('unable to fetch data when user no token present', async () => {
    const response: Response = await api.get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests`);

    expect(response.status).toEqual(401);
    expect(response.body.error).toBe('You must be signed in to do that.');
  });

  test('unable to fetch data when token invalid', async () => {
    const response: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests`)
      .set('Authorization', 'invalid-token');

    expect(response.status).toEqual(401);
    expect(response.body.error).toBe('You must be signed in to do that.');
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

    const requestsWithNeighborhoodInDb = await testHelpers.getNeighborhoodRequests(BOBS_NHOOD_ID);

    const response: Response = await api
      .get(`/api/neighborhoods/${BOBS_NHOOD_ID}/requests`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBe(requestsWithNeighborhoodInDb.length);
    expect(response.body[0].neighborhood_id).toBe(BOBS_NHOOD_ID);
  });
});
