import app from '../app';
// import seed from './seed';
import prisma from '../model/prismaClient';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const request = supertest(app);

beforeAll(async () => {
  // await seed();
});

describe('Testing GET method for neighborhood API.', () => {
  // test('All neighborhoods are returned', async () => {
  //   const response = await request.get('/neighborhoods');
  //   expect(response.status).toEqual(200);
  //   expect(response.body.length).toEqual(3);
  // });

  test('If no neighborhoods, return status 404', async () => {
    await prisma.neighborhood.deleteMany({});
    const response = await request.get('/neighborhoods');
    expect(response.status).toEqual(404);
  });
});
