import bcrypt from 'bcrypt';
import prismaClient from '../prismaClient';
import {createSubscriber} from '../src/services/notificationServices';

const SAMPLE_PASSWORD = 'secret';

/**
 * Generates a password hash using bcrypt library and 10 salt rounds
 * @param password plain-text password to generate hash
 * @returns Promise resolved to password-hash
 */
const getPasswordHash = async (password: string): Promise<string> => {
  const SALT_ROUNDS = 10;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return Promise.resolve(passwordHash);
};

/**
 * connects user to neighborhood in the db
 * @param userId
 * @param neighborhoodId
 */
const connectUsertoNeighborhood = async (
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
      password_hash: await getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const antonina = await prismaClient.user.create({
    data: {
      username: 'antonina',
      email: 'antonina@example.com',
      password_hash: await getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const shwetank = await prismaClient.user.create({
    data: {
      username: 'shwetank',
      email: 'shwetank@example.com',
      password_hash: await getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const radu = await prismaClient.user.create({
    data: {
      username: 'radu',
      email: 'radu@example.com',
      password_hash: await getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const mike = await prismaClient.user.create({
    data: {
      username: 'mike',
      email: 'mike@example.com',
      password_hash: await getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const maria = await prismaClient.user.create({
    data: {
      username: 'maria',
      email: 'maria@example.com',
      password_hash: await getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const leia = await prismaClient.user.create({
    data: {
      username: 'leia',
      email: 'leia@example.com',
      password_hash: await getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const users = [bob, radu, shwetank, antonina, maria, mike, leia];
  //---------------------------------------------------------

  // Add users as notification subscribers
  users.forEach(async user => {
    await createSubscriber(String(user.id), user.username, user.first_name || '', user.last_name || '')
  })

  //---------------------------------------------------------
  // Bob's Neighborhood
  const bobNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: bob.id,
      name: "Bob's Neighborhood",
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    },
  });

  await connectUsertoNeighborhood(bob.id, bobNeighborhood.id);
  await connectUsertoNeighborhood(mike.id, bobNeighborhood.id);

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

  await prismaClient.request.create({
    data: {
      neighborhood_id: bobNeighborhood.id,
      user_id: mike.id,
      title: 'I need help changing a lightbulb',
      content: 'Can anyone help me with changing the lightbulb this Saturday?',
      status: 'CLOSED',
    },
  });

  await prismaClient.request.create({
    data: {
      neighborhood_id: bobNeighborhood.id,
      user_id: mike.id,
      title: 'URGENT My cat fell from the balcony!',
      content: 'Please find Fluffy',
    },
  });

  await prismaClient.request.create({
    data: {
      neighborhood_id: bobNeighborhood.id,
      user_id: mike.id,
      title: 'I can\'t cook. Help!',
      content: 'I need someone to cook breakfast and dinner for me everyday. I don\'t want to pay anything btw.',
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

  await connectUsertoNeighborhood(antonina.id, antoninaNeighborhood.id);
  await connectUsertoNeighborhood(radu.id, antoninaNeighborhood.id);
  await connectUsertoNeighborhood(maria.id, antoninaNeighborhood.id);
  await connectUsertoNeighborhood(leia.id, antoninaNeighborhood.id);

  const raduRequest = await prismaClient.request.create({
    data: {
      neighborhood_id: antoninaNeighborhood.id,
      user_id: radu.id,
      title: 'Plant trees',
      content:
        'I want to plant some trees in the rezidential area this Sunday. Who wants to help?',
    },
  });

  // The variable will be used in the future when we add responses.
  // eslint-disable-next-line
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
      request_id: raduRequest.id,
      user_id: leia.id,
      content: 'I can also help out',
      status: 'PENDING',
    },
  });
  //---------------------------------------------------------

  // Shwetank's Neighborhood
  const shwetankNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: shwetank.id,
      name: "Shwetank's Neighborhood",
    },
  });

  await connectUsertoNeighborhood(shwetank.id, shwetankNeighborhood.id);

  //---------------------------------------------------------

  // More seed neighborhoods
  const neighborhoods = [];
  for (let count = 1; count < 28;) {
    for (let userIdx = 0; userIdx < users.length; userIdx += 1) {
      const neighborhood = prismaClient.neighborhood.create({
        data: {
          admin_id: users[userIdx].id,
          name: `Neighborhood ${count}`,
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        },
      }).then(neighborhood => {
        connectUsertoNeighborhood(users[userIdx].id, neighborhood.id);
      });

      neighborhoods.push(neighborhood);
      count += 1;
    }
  }

  await Promise.all(neighborhoods);
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
