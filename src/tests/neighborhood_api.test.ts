import { Prisma, PrismaClient } from '@prisma/client';
import app from '../../app';
import dbQuery from '../model/db_query';
import config from '../utils/config';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const prisma = new PrismaClient({
  datasources: {
    db: { url: config.POSTGRES_URL },
  },
});

const request = supertest(app);

beforeAll(async () => {

});

describe('Testing GET method for neighborhood API.', () => {
  test('All neighborhoods are returned', async () => {
    const response = await request.get('/neighborhoods');
    expect(response.status).toEqual(200);
  });
});
