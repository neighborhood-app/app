/* eslint-disable no-underscore-dangle */ // Need to access response._body
import app from '../app';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const api = supertest(app);

describe('Test No Matching Route', () => {
  test('GET /foo returns 404', async () => {
    const response = await api.get('/foo');
    expect(response.status).toEqual(404);
  });

  test('POST /foo returns 404', async () => {
    const response = await api.post('/foo');
    expect(response.status).toEqual(404);
  });
});
