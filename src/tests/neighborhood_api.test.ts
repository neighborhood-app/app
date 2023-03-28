import app from '../../app';
import dbQuery from '../model/db_query';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const request = supertest(app);

beforeAll(async () => {
  await dbQuery('DELETE FROM neighborhoods');
  await dbQuery("INSERT INTO neighborhoods (admin_id, name, description, location) values (1, 'Example', 'something', 'somewhere')");
});

describe('Testing GET method for neighborhood API.', () => {
  test('All neighborhoods are returned', async () => {
    const response = await request.get('/neighborhoods');
    expect(response.status).toEqual(200);
  });
});
