import { PrismaClient } from '@prisma/client';
import app from '../app';
import seed from './seed';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const prisma = new PrismaClient();

const request = supertest(app);

beforeEach(async () => {
  await seed();
});

describe('Testing GET method for neighborhood API.', () => {
  test('All neighborhoods are returned', async () => {
    const response = await request.get('/neighborhoods');
    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(3);
  });

  test('If no neighborhoods, return status 404', async () => {
    await prisma.neighborhood.deleteMany({});
    const response = await request.get('/neighborhoods');
    expect(response.status).toEqual(404);
  });
});

describe('Testing DELETE method for neighborhood API.', () => {
  test('Delete one neighborhood by id', async () => {
    const testNeighborhood = await prisma.neighborhood.findFirst({
      where: {
        name: "Antonina's Neighborhood",
      },
    });

    const response = await request.delete(`/neighborhoods/${testNeighborhood!.id}`);

    expect(response.text).toEqual('Neighborhood \'Antonina\'s Neighborhood\' has been deleted.');
    expect(response.status).toEqual(200);
  });

  test('If neighborhood doesn\'t exist, return 404 status', async () => {
    await prisma.neighborhood.deleteMany({});
    const response = await request.delete('/neighborhoods/1');

    expect(response.status).toEqual(404);
  });
});
