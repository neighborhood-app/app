import { Novu } from '@novu/node';
import { createHmac } from 'crypto';

// MOVE KEY TO .env file
const NOVU_API_KEY = '9cc0a07918a5743da4558428c33d6558';
const novu = new Novu(NOVU_API_KEY);

/**
 * Creates a new subscriber to receive notifications
 * @param id 
 * @param firstName 
 * @param lastName 
 */
export async function createSubscriber(id: string, firstName: string, lastName: string) {
  try {
    await novu.subscribers.identify(id, {
      firstName,
      lastName,
    });
  } catch (error) {
    console.log('Could not subscribe user for notifications.');
    console.error(error);
  }
}

/**
 * Generates an HMAC encrypted subscriberId
 * @param id - the subscriber id
 * @returns the encrypter subscriber id
 */
export function hashSubscriberId(id: string) {
  const hmacHash = createHmac('sha256', NOVU_API_KEY).update(id).digest('hex');
  console.log(hmacHash);

  return hmacHash;
}

/**
 * Sends a notification to an admin when a user asks to join their neighborhood
 * @param id (string) - subscriberId of the user requesting to join
 */
export async function triggerJoinNhood(id: string) {
  try {
    const res = await novu.trigger('join-neighborhood', {
      to: {
        subscriberId: id,
      },
      payload: {
        description: `User ${id} wants to join your neighborhood.`,
      },
    });

    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}
