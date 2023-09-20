// /* eslint-disable no-underscore-dangle */ // Need to access httpResponse._body
// // import { Neighborhood, User } from '@prisma/client';
import { Response } from 'supertest';
import app from '../app';
import seed from './seed';
import testHelpers from './testHelpers';
import { LoginData, UpdateRequestData, UpdateResponseData } from '../types';

const supertest = require("supertest"); // eslint-disable-line
// 'require' was used because supertest does not support import

const api = supertest(app);

const ANTONINAS_LOGIN_DATA: LoginData = {
  username: 'antonina',
  password: 'secret',
};

const BOBS_LOGIN_DATA: LoginData = {
  username: 'bob1234',
  password: 'secret',
};

const ANTONINAS_NHOOD_ID = 2;
const RADUS_REQUEST_ID = 2;
const ANTONINAS_RESPONSE_ID = 1;
const ANTONINAS_USER_ID = 2;
const MARIAS_USER_ID = 6;

const loginUser = async (loginData: LoginData) => {
  const loginResponse = await api.post('/api/login').send(loginData);

  return loginResponse;
};

beforeAll(async () => {
  await seed();
});

// We have ANTONINAS_RESPONSE (Antonina's user_id = 2, response_id = 1)
// The response is associated with RADUS_REQUEST (request_id = 2
// created by the user RADU, user_id = 4)
// RADUS_REQUEST is in ANTONINAS_NEIGHBORHOOD (neighborhood_id = 2, admin_id = 2)

describe('Tests for updating a response: PUT /responses/:id', () => {
  let token: string;

  beforeAll(async () => {
    const loginResponse: Response = await loginUser(ANTONINAS_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  beforeEach(async () => {
    await seed();
  });

  test("User cannot update Response if they aren't logged in", async () => {
    const newData: UpdateResponseData = { content: 'new content' };

    const httpResponse: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .send(newData);

    const responseInDbAfterUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );

    expect(httpResponse.status).toBe(401);
    expect(httpResponse.body.error).toBe('user not signed in');
    expect(responseInDbAfterUpdate.content).not.toBe(newData.content);
  });

  test("User cannot update httpResponse if they didn't create it", async () => {
    const loginResponse: Response = await loginUser(BOBS_LOGIN_DATA);
    const bobToken: string = loginResponse.body.token;

    const newData: UpdateResponseData = { content: 'test content' };

    const httpResponse: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${bobToken}`)
      .send(newData);

    const responseInDbAfterUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );

    expect(httpResponse.status).toBe(401);
    expect(httpResponse.body.error).toBe('User does not have edit rights.');
    expect(responseInDbAfterUpdate.content).not.toBe(newData.content);
  });

  test('Update with invalid properties raises an error', async () => {
    const invalidData = { invalid: 'Test' };

    const httpResponse: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);

    const responseInDbAfterUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );

    expect(httpResponse.status).toBe(400);
    // Does the following error message makes sense here?
    // Probably a very minor thing which can be ignored
    expect(httpResponse.body.error).toBe(
      'Content and/or status value is invalid.',
    );
    expect(responseInDbAfterUpdate).not.toHaveProperty('invalid');
  });

  test('Update with invalid values raises an error', async () => {
    const invalidContentData = {
      content: 2,
    };

    const invalidStatusData = {
      status: 'random string',
    };

    const responseInDbBeforeUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );

    const response1: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidContentData);

    expect(response1.status).toBe(400);
    expect(response1.body.error).toBe(
      'Content and/or status value is invalid.',
    );

    const response2: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidStatusData);

    expect(response2.status).toBe(400);
    expect(response2.body.error).toBe(
      'Content and/or status value is invalid.',
    );

    const responseInDbAfterUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );

    expect(responseInDbAfterUpdate).toEqual(responseInDbBeforeUpdate);
  });

  test("Empty input doesn't change anything on the server", async () => {
    const responseInDbBeforeUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );

    const httpResponse: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    const responseInDbAfterUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );

    expect(httpResponse.body.id).toBe(ANTONINAS_RESPONSE_ID);
    expect(responseInDbAfterUpdate).toEqual(responseInDbBeforeUpdate);
    expect(httpResponse.status).toEqual(200);
  });

  test('id, user_id, request_id and time_created fields cannot be edited', async () => {
    // Cheking for failure to update id
    const response1 = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: 1000 });

    expect(response1.status).toBe(400);
    expect(response1.body.error).toBe(
      'Content and/or status value is invalid.',
    );

    // Checking for failure to update user_id
    const response2 = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: 1000 });

    expect(response2.status).toBe(400);
    expect(response2.body.error).toBe(
      'Content and/or status value is invalid.',
    );

    // Checking for failure to update request_id
    const response3 = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ request_id: 1000 });

    expect(response3.status).toBe(400);
    expect(response3.body.error).toBe(
      'Content and/or status value is invalid.',
    );

    // Checking for failure to update time_created
    const response4 = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ time_created: new Date() });

    expect(response4.status).toBe(400);
    expect(response4.body.error).toBe(
      'Content and/or status value is invalid.',
    );

    const responseInDbAfterUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );
    expect(responseInDbAfterUpdate).toEqual(responseInDbAfterUpdate);
  });

  test('Able to change to status of response to ACCEPTED', async () => {
    const initialResponseInDb = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );
    expect(initialResponseInDb.status).toBe('PENDING');

    // Why can we not use type of `updateData` to be `UpdateRequestData` ?
    // TS still expects `status` field to be of type `number`
    const updateData: UpdateResponseData = {
      status: 'ACCEPTED',
    };

    const httpResponse: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body.id).toBe(ANTONINAS_RESPONSE_ID);
    expect(httpResponse.body.status).toBe('ACCEPTED');
    expect(httpResponse.body.content).toBe(initialResponseInDb.content);

    const finalResponseInDb = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );

    expect(finalResponseInDb).toEqual({
      ...initialResponseInDb,
      status: 'ACCEPTED',
    });
  });

  test('Able to change the content of response', async () => {
    const initialResponseInDb = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );

    const updateData = {
      content: 'test content',
    };

    const httpResponse: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body.id).toBe(ANTONINAS_RESPONSE_ID);
    expect(httpResponse.body.status).toBe('PENDING');
    expect(httpResponse.body.content).toBe(updateData.content);

    const finalResponseInDb = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );

    expect(finalResponseInDb.id).toBe(initialResponseInDb.id);
    expect(finalResponseInDb.request_id).toBe(initialResponseInDb.request_id);
    expect(finalResponseInDb.user_id).toBe(initialResponseInDb.user_id);
    expect(finalResponseInDb.status).toBe(initialResponseInDb.status);
    expect(finalResponseInDb.content).toBe(updateData.content);
  });
});

describe('Tests for deleting a response: DELETE /responses/:id', () => {
  let token: string;

  beforeAll(async () => {
    const loginResponse: Response = await loginUser(ANTONINAS_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  beforeEach(async () => {
    await seed();
  });

  test("User cannot delete a response if they aren't logged in", async () => {
    const httpResponse: Response = await api.delete(
      `/api/responses/${ANTONINAS_RESPONSE_ID}`,
    );

    const responseInDb = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );

    expect(httpResponse.status).toEqual(401);
    expect(httpResponse.body.error).toBe('user not signed in');
    expect(responseInDb).not.toBe(null);
  });

  test('Delete non-existent response fails', async () => {
    const NON_EXISTENT_ID = 1000;

    const httpResponse: Response = await api
      .delete(`/api/responses/${NON_EXISTENT_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(httpResponse.status).toBe(404);
    expect(httpResponse.body.error).toBe('No Response found');
  });

  test('User cannot delete response if not its creator or admin', async () => {
    const loginResponse = await loginUser(BOBS_LOGIN_DATA);
    const bobsToken: string = loginResponse.body.token;

    const httpResponse: Response = await api
      .delete(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${bobsToken}`);

    const responseInDb = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID,
    );

    expect(httpResponse.status).toEqual(401);
    expect(responseInDb).not.toBe(null);
  });

  test('Delete an existing response as the creator', async () => {
    const httpResponse: Response = await api
      .delete(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${token}`);

    let deleted;
    try {
      deleted = await testHelpers.getSingleResponse(ANTONINAS_RESPONSE_ID);
    } catch (error) {
      deleted = null;
    }

    expect(httpResponse.status).toEqual(204);
    expect(deleted).toBe(null);
  });

  // In the Test Data, The Creator of the Response and Admin of neighborhood
  // are same. Hence test for deleting as admin does not make sense.
  // We are not testing for deleting response as admin of neighborhood.

  // We have ANTONINAS_RESPONSE (Antonina's user_id = 2, response_id = 1)
  // The response is associated with RADUS_REQUEST (request_id = 2
  // created by the user RADU, user_id = 4)
  // RADUS_REQUEST is in ANTONINAS_NEIGHBORHOOD (neighborhood_id = 2, admin_id = 2)

  // More Users in Antonina's neighborhood - Maria (user_id = 6)

  test('Delete an existing request as admin of neighborhood', async () => {
    const mariasResponse = await testHelpers.createResponse(
      RADUS_REQUEST_ID,
      MARIAS_USER_ID,
      'new content',
    );

    expect(mariasResponse.id).toBeDefined();
    const mariasResponseId: number = mariasResponse.id;
    const mariasResponseInDb = await testHelpers.getSingleResponse(
      mariasResponseId,
    );
    expect(mariasResponseInDb).toBeDefined();

    const httpResponse: Response = await api
      .delete(`/api/requests/${mariasResponseId}`)
      .set('Authorization', `Bearer ${token}`);

    let deletedResponse;
    try {
      deletedResponse = await testHelpers.getSingleResponse(mariasResponseId);
    } catch (error) {
      deletedResponse = null;
    }

    expect(httpResponse.status).toEqual(204);
    expect(deletedResponse).toBe(null);
  });
});

describe('Test for getting a single response at GET /responses/:id', () => {
  let token: string;

  beforeAll(async () => {
    await seed();
    const loginResponse: Response = await loginUser(ANTONINAS_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  test('GET responses/:id fails when no authorization header present', async () => {
    const getResponse: Response = await api.get(
      `/api/responses/${ANTONINAS_RESPONSE_ID}`,
    );

    expect(getResponse.status).toEqual(401);
    expect(getResponse.body.error).toEqual('user not signed in');
  });

  test('GET /responses/:id/ fails when user request not found', async () => {
    const INVALID_RESPONSE_ID = 1000;

    const getResponse: Response = await api
      .get(`/api/responses/${INVALID_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).toEqual(404);
    expect(getResponse.body.error).toEqual('No Response found');
  });

  test('GET /responses/:id/ fails when user not the member of neighborhood', async () => {
    const loginResponse: Response = await loginUser(BOBS_LOGIN_DATA);
    const bobToken: string = loginResponse.body.token;

    const getResponse: Response = await api
      .get(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${bobToken}`);

    expect(getResponse.status).toEqual(401);
    expect(getResponse.body.error).toEqual('User is not part of neighborhood.');
  });

  test('GET /responses/:id/ works when user is creator', async () => {
    const getResponse: Response = await api
      .get(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).toEqual(200);
    expect(getResponse.body.id).toBe(ANTONINAS_RESPONSE_ID);
    expect(getResponse.body.user_id).toBe(ANTONINAS_USER_ID);
    expect(getResponse.body.request_id).toBe(RADUS_REQUEST_ID);
  });
});

describe('Tests for creating a new response at POST /responses', () => {
  let token: string;

  beforeAll(async () => {
    const loginResponse: Response = await loginUser(ANTONINAS_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  beforeEach(async () => {
    await seed();
  });

  test('POST /responses fails when no token exists', async () => {
    const numberOfInitialResponses = await testHelpers.getNumberOfResponses();

    const httpResponse: Response = await api.post('/api/responses');

    const numberOfFinalResponses = await testHelpers.getNumberOfResponses();

    expect(httpResponse.status).toEqual(401);
    expect(httpResponse.body.error).toEqual('user not signed in');
    expect(numberOfInitialResponses).toEqual(numberOfFinalResponses);
  });

  test('POST /responses fails when data missing', async () => {
    const numberOfInitialResponses = await testHelpers.getNumberOfResponses();

    // no content
    const httpResponse1 = await api
      .post('/api/responses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        request_id: RADUS_REQUEST_ID,
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(httpResponse1.body.error).toEqual(
      'Content property missing or invalid',
    );

    // no request_id
    const httpResponse2 = await api
      .post('/api/responses')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'test content' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(httpResponse2.body.error).toBe(
      'Content property missing or invalid',
    );

    const numberOfCurrentResponses = await testHelpers.getNumberOfResponses();
    expect(numberOfCurrentResponses).toEqual(numberOfInitialResponses);
  });

  test('POST /responses fails when request does not exist', async () => {
    const numberOfInitialResponses = await testHelpers.getNumberOfResponses();

    const httpResponse = await api
      .post('/api/responses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'test content',
        request_id: 10000, // Invalid Request Id
        neighborhood_id: ANTONINAS_NHOOD_ID,
      })
      .expect(404)
      .expect('Content-Type', /application\/json/);

    const numberOfFinalResponses = await testHelpers.getNumberOfResponses();
    expect(numberOfFinalResponses).toEqual(numberOfInitialResponses);
    expect(httpResponse.body.error).toBe('No Request found');
  });

  test('POST /request fails when user not member of neighborhood', async () => {
    const loginResponse: Response = await loginUser(BOBS_LOGIN_DATA);
    const bobsToken: string = loginResponse.body.token;

    const numberOfInitialResponses = await testHelpers.getNumberOfResponses();

    const httpResponse = await api
      .post('/api/responses')
      .set('Authorization', `Bearer ${bobsToken}`)
      .send({
        content: 'test content',
        request_id: RADUS_REQUEST_ID,
        neighborhood_id: ANTONINAS_NHOOD_ID,
      })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const numberOfCurrentResponses = await testHelpers.getNumberOfResponses();
    expect(numberOfCurrentResponses).toEqual(numberOfInitialResponses);
    expect(httpResponse.body.error).toBe('User is not authorized to respond.');
  });

  test('POST /responses succeeds with valid data', async () => {
    const numOfInitialResponses = await testHelpers.getNumberOfResponses();

    const httpResponse = await api
      .post('/api/responses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'test content',
        request_id: RADUS_REQUEST_ID,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newResponseId = httpResponse.body.id;
    expect(newResponseId).toBeDefined();
    expect(httpResponse.body.request_id).toBe(RADUS_REQUEST_ID);
    expect(httpResponse.body.user_id).toBe(ANTONINAS_USER_ID);
    expect(httpResponse.body.content).toBe('test content');
    expect(httpResponse.body.status).toBe('PENDING');

    const numOfFinalResponses = await testHelpers.getNumberOfResponses();
    expect(numOfFinalResponses).toBe(numOfInitialResponses + 1);

    const newResponseInDb = await testHelpers.getSingleResponse(newResponseId);

    expect(newResponseInDb.request_id).toBe(RADUS_REQUEST_ID);
    expect(newResponseInDb.user_id).toBe(ANTONINAS_USER_ID);
    expect(newResponseInDb.content).toBe('test content');
    expect(newResponseInDb.status).toBe('PENDING');
  });
});
