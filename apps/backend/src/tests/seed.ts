import prismaClient from '../../prismaClient';
import testHelpers from './testHelpers';

const SAMPLE_PASSWORD = 'secret';

/**
 * connects user to neighborhood in the db
 * @param userId
 * @param neighborhoodId
 */
const connectUsertoNeighborhood = async (userId: number, neighborhoodId: number): Promise<void> => {
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

  //Create users
  const bob = await prismaClient.user.create({
    data: {
      user_name: 'bob1234',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const antonina = await prismaClient.user.create({
    data: {
      user_name: 'antonina',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const shwetank = await prismaClient.user.create({
    data: {
      user_name: 'shwetank',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const radu = await prismaClient.user.create({
    data: {
      user_name: 'radu',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const mike = await prismaClient.user.create({
    data: {
      user_name: 'mike',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const maria = await prismaClient.user.create({
    data: {
      user_name: 'maria',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });
  //---------------------------------------------------------

  //Bob's Neighborhood
  const bobNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: bob.id,
      name: "Bob's Neighborhood",
    },
  });

  await connectUsertoNeighborhood(bob.id, bobNeighborhood.id);
  await connectUsertoNeighborhood(mike.id, bobNeighborhood.id);

  const mikeRequest = await prismaClient.request.create({
    data: {
      neighborhood_id: bobNeighborhood.id,
      user_id: mike.id,
      title: 'Help moving furniture in apartment',
      content: 'I need help moving my furniture this Saturday'
    },
  });
  //---------------------------------------------------------

  //Antonina's Neighborhood
  const antoninaNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: antonina.id,
      name: "Antonina's Neighborhood",
    },
  });

  await connectUsertoNeighborhood(antonina.id, antoninaNeighborhood.id);
  await connectUsertoNeighborhood(radu.id, antoninaNeighborhood.id);
  await connectUsertoNeighborhood(maria.id, antoninaNeighborhood.id);

  const raduRequest = await prismaClient.request.create({
    data: {
      neighborhood_id: antoninaNeighborhood.id,
      user_id: radu.id,
      title: 'Plant trees',
      content: 'I want to plant some trees in the rezidential area this Sunday. Who wants to help?'
    },
  });

  const mariaRequest = await prismaClient.request.create({
    data: {
      neighborhood_id: antoninaNeighborhood.id,
      user_id: maria.id,
      title: 'Install washing machine',
      content: 'Can anyone help me install a washing machine?'
    },
  });
  //---------------------------------------------------------

  //Shwetank's Neighborhood
  const shwetankNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: shwetank.id,
      name: "Shwetank's Neighborhood",
    },
  });

  await connectUsertoNeighborhood(shwetank.id, shwetankNeighborhood.id);
}

export default main;
