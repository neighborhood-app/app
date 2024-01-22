/* eslint-disable no-underscore-dangle */ // Need to access response._body
import app from '../app';
import { CreateUserData, LoginData } from '../types';
import main from './seed';
import testHelpers from './testHelpers';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const api = supertest(app);

const loginData: LoginData = {
  username: 'johnsmith',
  password: 'secret',
};

beforeAll(async () => {
  await testHelpers.removeAllData();

  const newUser: CreateUserData = {
    ...loginData,
    email: 'johnsmith@example.com',
  };

  await api
    .post('/api/users')
    .send(newUser);
});

afterAll(async () => {
  await main();
});

describe('Tests for logging in the app: POST /login', () => {
  test('Able to login with valid username and password', async () => {
    const response = await api
      .post('/api/login')
      .send(loginData)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const responseBody = response._body;

    expect(responseBody.username).toBe(loginData.username);
    expect(responseBody.token).toBeDefined();
  });

  test('Unable able to login with invalid username or invalid password', async () => {
    const loginData1: LoginData = {
      username: loginData.username,
      password: 'WrongPassword',
    };

    const response = await api
      .post('/api/login')
      .send(loginData1)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response._body.error).toBe('invalid username or password');

    const loginData2: LoginData = {
      username: 'WrongUsername',
      password: loginData.password,
    };

    const response2 = await api
      .post('/api/login')
      .send(loginData2)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response2._body.error).toBe('invalid username or password');
  });

  test('Unable to login if user is already logged in', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send(loginData);

    const { token } = loginResponse.body;

    const response = await api
      .post('/api/login')
      .set('Authorization', `Bearer ${token}`)
      .send(loginData)
      .expect(409)
      .expect('Content-Type', /application\/json/);

    // This would better be handled differently, e.g. using `loggedUserId`
    expect(response.request._data.username).toBe(loginData.username);
    expect(response.body.error).toBe('user already logged in');
  });
});
