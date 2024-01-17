import { Novu } from '@novu/node';
import { createHmac } from 'crypto';
import { JoinNeighborhoodArgs } from '../types';

// MOVE KEY TO .env file
const NOVU_API_KEY = '9cc0a07918a5743da4558428c33d6558';
const novu = new Novu(NOVU_API_KEY);

/**
 * Creates a new subscriber to receive notifications
 * @param id
 * @param firstName
 * @param lastName
 */
export async function createSubscriber(id: string, username: string, firstName: string, lastName: string) {
  try {
    await novu.subscribers.identify(id, {
      firstName,
      lastName,
      data: {
        username,
      }
    });
  } catch (error) {
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

  return hmacHash;
}

/**
 * 
 * @param subscriberId (number)
 * @param notificationId (string) - the id of the associated notification
 * @param status (string) - the status to set the action to
 * @param btnType - the type of the button (primary/secondary)
 * @returns 
 */
// export async function markActionDone(
//   subscriberId: number,
//   notificationId: string,
//   status: string,
//   btnType: string,
// ) {
//   const options = {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', Authorization: `ApiKey ${NOVU_API_KEY}` },
//     body: JSON.stringify({ payload: {}, status }),
//   };

//   const res = await fetch(
//     `https://api.novu.co/v1/subscribers/${subscriberId}/messages/${notificationId}/actions/${btnType}`,
//     options,
//   )
//     .then((response) => response.json())
//     .then((data) => data)
//     .catch((error) => console.error('Error:', error));
  
//   console.log('res from marking as done', res.data.cta);
  
//   return res;
// }

export const triggers = {
  /**
   * Sends a notification to an admin when a user asks to join their neighborhood.
   * The function receives an object with the following props:
   * @param adminId (string) - id of the neighborhood admin
   * @param userId (string) - subscriberId of the user requesting to join
   * @param neighborhoodId (string) - the id of the neighborhood to join
   * @param neighborhoodName (string)
   * @param username (string) - username of the user requesting to join
   */
  async joinNeighborhood({ adminId, userId, neighborhoodId, neighborhoodName, username }: JoinNeighborhoodArgs) {
    try {
      await novu.trigger('join-neighborhood', {
        to: {
          subscriberId: adminId,
        },
        payload: {
          neighborhoodId,
          neighborhoodName,
          username,
          userId,
        },
      });
    } catch (error) {
      console.error('Failed to trigger join-neighborhood notification', error);
    }
  },
};