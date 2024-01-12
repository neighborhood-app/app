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
 * @param adminId (string) - id of the neighborhood admin
 * @param subscriberId (string) - subscriberId of the user requesting to join
 * @param neighborhoodId (string) - the id of the neighborhood to join
 */
export async function triggerJoinNhood(adminId: string, subscriberId: string, neighborhoodId: string) {
  try {
    const res = await novu.trigger('join-neighborhood', {
      to: {
        subscriberId: adminId,
      },
      payload: {
        description: `User ${subscriberId} wants to join neighborhood ${neighborhoodId}.`,
      },
    });

    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
}

export const triggers = {
  /**
   * Sends a notification to an admin when a user asks to join their neighborhood
   * @param adminId (string) - id of the neighborhood admin
   * @param subscriberId (string) - subscriberId of the user requesting to join
   * @param neighborhoodId (string) - the id of the neighborhood to join
   */
  async joinNeighborhood(adminId: string, subscriberId: string, neighborhoodId: string) {
    try {
      await novu.trigger('join-neighborhood', {
        to: {
          subscriberId: adminId,
        },
        payload: {
          description: `User ${subscriberId} wants to join neighborhood ${neighborhoodId}.`,
          neighborhoodId,
        },
      });

    } catch (error) {
      console.log(error);
    }
  },
};
