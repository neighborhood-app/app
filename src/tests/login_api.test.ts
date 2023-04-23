/* eslint-disable no-underscore-dangle */ // Need to access response._body
import app from '../app';
import { LoginData } from '../types';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const api = supertest(app);

describe('General login tests', () => {
  const USERNAME = 'johnsmith';
  const PASSWORD = 'secret';

  test('Able to login with valid username and password', async () => {
    const loginData: LoginData = {
      username: USERNAME,
      password: PASSWORD,
    };

    const response = await api
      .post('/api/login')
      .send(loginData)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const responseBody = response._body;

    expect(responseBody.username).toBe(USERNAME);
    expect(responseBody.token).toBeDefined();
  });

  test('Unable able to login with invalid username or invalid password', async () => {
    const loginData1: LoginData = {
      username: USERNAME,
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
      password: PASSWORD,
    };

    const response2 = await api
      .post('/api/login')
      .send(loginData2)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response2._body.error).toBe('invalid username or password');
  });
});
