import { PrismaClient } from '@prisma/client';
import app from '../app';
import seed from './seed';

const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import

const prisma = new PrismaClient();

const request = supertest(app);

beforeAll(async () => {
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
    const joe = await prisma.user.create({
      data: {
        user_name: 'Joe',
        password: 'example',
      },
    });

    const joeNeighborhood = await prisma.neighborhood.create({
      data: {
        admin_id: joe.id,
        name: "Joe's Neighborhood",
      },
    });

    const response = await request.delete(`/neighborhoods/${joeNeighborhood.id}`);
    expect(response.status).toEqual(200);
  });

  test('If no neighborhoods exist, return 404 status', async () => {
    await prisma.neighborhood.deleteMany({});
    const response = await request.get('/neighborhoods/1');
    expect(response.status).toEqual(404);
  });
});
