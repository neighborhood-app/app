/* eslint-disable no-underscore-dangle */ // Need to access response._body
import app from '../app';
import prisma from '../model/prismaClient';
import { UserWithoutPasswordHash } from '../types';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const api = supertest(app);

describe('Test No Matching Route', () => {
  test('GET /foo', async () => {
    const response = await api.get('/foo');
    expect(response.status).toEqual(404);
  });

  test('POST /foo', async () => {
    const response = await api.post('/foo');
    expect(response.status).toEqual(404);
  });
});

describe('when there is initially no user in db', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  test('creation succeeds with valid data', async () => {
    const newUser = {
      username: 'johnsmith',
      password: 'secret',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const body: UserWithoutPasswordHash = response._body;
    expect(body.user_name).toBe('johnsmith');

    // need to update to ensure that the user is added to the db
  });

  test('creation fails with proper statuscode and message if username or password missing', async () => {
    const dataWithoutUsername = {
      password: 'secret',
    };

    const response1 = await api
      .post('/api/users')
      .send(dataWithoutUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response1._body.error).toBe('Username or Password missing');

    const dataWithoutPassword = {
      password: 'secret',
    };

    const response2 = await api
      .post('/api/users')
      .send(dataWithoutPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response2._body.error).toBe('Username or Password missing');
  });

  test('creation fails with proper statuscode and message if username or password too short', async () => {
    const dataWithShortUsername = {
      username: 'foo',
      password: 'secret',
    };

    const response1 = await api
      .post('/api/users')
      .send(dataWithShortUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response1._body.error).toBe('Invalid Username');

    const dataWithShortPassword = {
      username: 'johnsmith',
      password: 'foo',
    };

    const response2 = await api
      .post('/api/users')
      .send(dataWithShortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response2._body.error).toBe('Invalid Password');
  });
});
