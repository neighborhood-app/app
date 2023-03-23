import app from '../../app';

const supertest = require('supertest'); // eslint-disable-line
// require was used because supertest does not support import

const api = supertest(app);

describe('Testing GET method for neighborhood API.', () => {
  test('All neighborhoods are returned', async () => {
    const response = await api.get('/neighborhoods');
    expect(response.status).toEqual(200);
  });
});
