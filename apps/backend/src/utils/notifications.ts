import { Novu } from '@novu/node';

// MOVE KEY TO .env file
const novu = new Novu('9cc0a07918a5743da4558428c33d6558');

export async function createSubscriber(id:string, firstName:string, lastName:string) {
  await novu.subscribers.identify(id, {
    firstName,
    lastName,
  });
}

export async function triggerNotification(id: string) {
  try {
    const res = await novu.trigger('test-workflow', {
      to: {
        subscriberId: id,
      },
      payload: {
        description: 'Test notification',
      },
    });

    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}
