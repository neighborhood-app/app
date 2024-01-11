import { Novu } from '@novu/node';

// MOVE KEY TO .env file
const novu = new Novu('9cc0a07918a5743da4558428c33d6558');

export default async function createSubscriber() {
  await novu.subscribers.identify('789', {
    firstName: 'Sumit',
    lastName: 'Saurabh',
  });
}