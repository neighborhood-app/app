import prismaClient from '../../prismaClient';
import testHelpers from './testHelpers';

const SAMPLE_PASSWORD = 'secret';

/**
 * connects user to neighborhood in the db
 * @param userId
 * @param neighborhoodId
 */
const connectUserToNeighborhood = async (
  userId: number,
  neighborhoodId: number,
): Promise<void> => {
  await prismaClient.neighborhood.update({
    where: { id: neighborhoodId },
    data: {
      users: {
        connect: { id: userId },
      },
    },
  });
};

async function main() {
  // clearing the existing db
  await testHelpers.removeAllData();

  await prismaClient.gender.createMany({
    data: [
      {
        name: 'male',
      },
      {
        name: 'female',
      },
    ],
  });

  // Create users
  const bob = await prismaClient.user.create({
    data: {
      username: 'bob1234',
      email: 'bob1234@example.com',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const antonina = await prismaClient.user.create({
    data: {
      username: 'antonina',
      email: 'antonina@example.com',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const shwetank = await prismaClient.user.create({
    data: {
      username: 'shwetank',
      email: 'shwetank@example.com',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const radu = await prismaClient.user.create({
    data: {
      username: 'radu',
      email: 'radu@example.com',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const mike = await prismaClient.user.create({
    data: {
      username: 'mike',
      email: 'mike@example.com',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const maria = await prismaClient.user.create({
    data: {
      username: 'maria',
      email: 'maria@example.com',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });
  //---------------------------------------------------------

  // Bob's Neighborhood
  const bobNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: bob.id,
      name: "Bob's Neighborhood",
    },
  });

  await connectUserToNeighborhood(bob.id, bobNeighborhood.id);
  await connectUserToNeighborhood(mike.id, bobNeighborhood.id);

  // The variable will be used in the future when we add responses.
  // eslint-disable-next-line
  const mikeRequest = await prismaClient.request.create({
    data: {
      neighborhood_id: bobNeighborhood.id,
      user_id: mike.id,
      title: 'Help moving furniture in apartment',
      content: 'I need help moving my furniture this Saturday',
    },
  });
  //---------------------------------------------------------

  // Antonina's Neighborhood
  const antoninaNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: antonina.id,
      name: "Antonina's Neighborhood",
    },
  });

  await connectUserToNeighborhood(antonina.id, antoninaNeighborhood.id);
  await connectUserToNeighborhood(radu.id, antoninaNeighborhood.id);
  await connectUserToNeighborhood(maria.id, antoninaNeighborhood.id);

  const raduRequest = await prismaClient.request.create({
    data: {
      neighborhood_id: antoninaNeighborhood.id,
      user_id: radu.id,
      title: 'Plant trees',
      content:
        'I want to plant some trees in the rezidential area this Sunday. Who wants to help?',
    },
  });

  const mariaRequest = await prismaClient.request.create({
    data: {
      neighborhood_id: antoninaNeighborhood.id,
      user_id: maria.id,
      title: 'Install washing machine',
      content: 'Can anyone help me install a washing machine?',
    },
  });

  await prismaClient.response.create({
    data: {
      request_id: raduRequest.id,
      user_id: antonina.id,
      content: 'I can help out',
      status: 'PENDING',
    },
  });

  await prismaClient.response.create({
    data: {
      request_id: mariaRequest.id,
      user_id: radu.id,
      content: 'I can help!',
    },
  });
  //---------------------------------------------------------

  // The variable will be used in the future when we add responses.
  // eslint-disable-next-line
  //Shwetank's Neighborhood
  const shwetankNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: shwetank.id,
      name: "Shwetank's Neighborhood",
    },
  });

  await connectUserToNeighborhood(shwetank.id, shwetankNeighborhood.id);
}

export default main;
