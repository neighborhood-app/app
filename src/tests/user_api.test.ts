/* eslint-disable no-underscore-dangle */ // Need to access response._body
import app from '../app';
import prismaClient from '../model/prismaClient';
import { UserWithoutPasswordHash } from '../types';
import testHelpers from './testHelpers';

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
    await prismaClient.user.deleteMany({});
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

    const users = await testHelpers.usersInDb();
    expect(users).toHaveLength(1);
    expect(users[0].user_name).toBe('johnsmith');
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

describe('when there is one user in db', () => {
  beforeEach(async () => {
    await prismaClient.user.deleteMany({});
    await prismaClient.user.create({
      data: testHelpers.INITIAL_USER_DATA_WITHOUT_ID,
    });
  });

  test('unable to add user with same username', async () => {
    const newUser = {
      username: 'johnsmith',
      password: 'secret',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response._body.error).toBe('User already exists');
  });

  test('able to create user with different username and valid data', async () => {
    const usersBeforeTest = await testHelpers.usersInDb();
    const newUser = {
      username: 'drewneil',
      password: 'secret',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const body: UserWithoutPasswordHash = response._body;
    expect(body.user_name).toBe('drewneil');

    const usersAfterTest = await testHelpers.usersInDb();
    expect(usersAfterTest.length).toBe(usersBeforeTest.length + 1);

    const usernames = usersAfterTest.map(user => user.user_name);
    expect(usernames).toContain('drewneil');
  });
});
