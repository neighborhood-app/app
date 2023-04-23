import app from '../app';
import prismaClient from '../../prismaClient';
import testHelpers from './testHelpers';
import { CreateUserData, UserWithoutPasswordHash } from '../types';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const api = supertest(app);

describe('When there is initially no user in db', () => {
  beforeEach(async () => {
    await prismaClient.user.deleteMany({});
  });

  test('Creating User succeeds with valid data', async () => {
    const newUser: CreateUserData = {
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

  test('Creating User fails with proper statuscode and message if username or password missing', async () => {
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
      username: 'johnsmith',
    };

    const response2 = await api
      .post('/api/users')
      .send(dataWithoutPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response2._body.error).toBe('Username or Password missing');
  });

  test('Creating User fails with proper statuscode and message if username or password too short', async () => {
    const dataWithShortUsername: CreateUserData = {
      username: 'foo',
      password: 'secret',
    };

    const response1 = await api
      .post('/api/users')
      .send(dataWithShortUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response1._body.error).toBe('Invalid Username');

    const dataWithShortPassword: CreateUserData = {
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

describe('When there is initially one user in db', () => {
  const USERNAME = 'johnsmith';
  const PASSWORD = 'secret';
  const createUserData: CreateUserData = {
    username: USERNAME,
    password: PASSWORD,
  };

  beforeEach(async () => {
    await prismaClient.user.deleteMany({});
    await testHelpers.seedUser(createUserData);
  });

  test('Unable to add user with same username', async () => {
    const newUser: CreateUserData = {
      username: USERNAME,
      password: 'someOtherPassword',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response._body.error).toBe('User already exists');
  });

  test('Able to create user with different username and valid data', async () => {
    const usersBeforeTest = await testHelpers.usersInDb();
    const newUser: CreateUserData = {
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
