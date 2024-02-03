import { Novu } from '@novu/node';
import { createHmac } from 'crypto';
import { JoinNeighborhoodArgs, Request, Subscriber } from '../types';
import requestServices from './requestServices';

// MOVE KEY TO .env file
const NOVU_API_KEY = '9cc0a07918a5743da4558428c33d6558';
const novu = new Novu(NOVU_API_KEY);

/**
 * Creates a new topic that groups together a set of subscribers (need to be added with `addSubscribersToTopic`)
 * to receive bulk notifications.
 * @param key unique identifier for the topic
 * @param name descriptive name to explain topic's purpose
 */
export async function createTopic(key: string, name: string) {
  const result = await novu.topics.create({
    key,
    name,
  });

  console.log(result.data);
}

/**
 * Adds a list of subscribers to a topic.
 * @param key topic identifier
 * @param subscriberIds an array of the subscriber ids as numbers
 */
export async function addSubscribersToTopic(key: string, subscriberIds: number[]) {
  const response = await novu.topics.addSubscribers(key, {
    subscribers: subscriberIds.map(String),
  });

  console.log(response.data);
}

/**
 * Creates a new subscriber to receive notifications
 * @param id
 * @param firstName
 * @param lastName
 */
export async function createSubscriber(
  id: string,
  username: string,
  firstName: string,
  lastName: string,
) {
  try {
    await novu.subscribers.identify(id, {
      firstName,
      lastName,
      data: {
        username,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Retrieves a single subcriber by id.
 * @param subscriberId (string) - the id of the subscriber to retrieve
 * @returns the subcriber object or a custom error object if an error occurs
 */
export async function getSubscriber(subscriberId: string) {
  try {
    const response = await novu.subscribers.get(subscriberId);
    return response.data;
  } catch (error: unknown) {
    console.error(`Could not retrieve subscriber with id ${subscriberId}`, error);
    return { error: `Could not retrieve subscriber with id ${subscriberId}` };
  }
}

/**
 * Retrieves all subscribers.
 * @returns all subcribers or a custom error object if an error occurs
 */
export async function getAllSubscribers() {
  const options = { method: 'GET', headers: { Authorization: `ApiKey ${NOVU_API_KEY}` } };
  const subscribers: Subscriber[] = await fetch('https://api.novu.co/v1/subscribers', options)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => {
      console.error('Could not retrieve subscribers.', error);
      return { error: 'Could not retrieve subscribers.' };
    });

  return subscribers;
}

/**
 * Deletes a single subcriber by id.
 * @param subscriberId (string) - the id of the subscriber to delete
 */
export async function deleteSubscriber(subscriberId: string) {
  try {
    await novu.subscribers.delete(subscriberId);
  } catch (error: unknown) {
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
  async joinNeighborhood({
    adminId,
    userId,
    neighborhoodId,
    neighborhoodName,
    username,
  }: JoinNeighborhoodArgs) {
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
    } catch (error: unknown) {
      console.error('Failed to trigger join-neighborhood notification', error);
    }
  },
  /**
   * Sends a notification to the requester when a user responds to them.
   * @param requestId (string) - id of the request the user received a repsonse for
   * @param subscriberId (string) - the subscriber id of the user who responded
   */
  async receiveResponse(requestId: string, subscriberId: string) {
    try {
      const request: Request = await requestServices.getRequestById(+requestId);
      const reqAuthorId = String(request.user_id);

      await novu.trigger('receive-response', {
        to: {
          subscriberId: reqAuthorId,
        },
        actor: { subscriberId },
        payload: {
          requestId,
        },
      });
    } catch (error: unknown) {
      console.error('Failed to trigger receive-response notification', error);
    }
  },
};
