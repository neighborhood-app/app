import { Novu, TriggerRecipientsTypeEnum } from '@novu/node';
import { createHmac } from 'crypto';
import { JoinNeighborhoodArgs, Request, Subscriber, Topic } from '../types';
import requestServices from './requestServices';
import responseServices from './responseServices';

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
  try {
    await novu.topics.create({ key, name });
  } catch (error: unknown) {
    if (typeof error === 'object' && error && 'data' in error) console.error(error.data);
  }
}

/**
 * Adds a list of subscribers to a topic.
 * @param key topic identifier
 * @param subscriberIds an array of the subscriber ids as numbers
 */
export async function addSubscribersToTopic(key: string, subscriberIds: number[]) {
  try {
    await novu.topics.addSubscribers(key, {
      subscribers: subscriberIds.map(String),
    });
  } catch (error) {
    console.log((error as Error).message);
  }
}

/**
 * Removes all subscribers from a topic and then deletes it
 * @param topic the Topic object to remove
 */
export async function deleteTopic(topic: Topic) {
  try {
    await novu.topics.removeSubscribers(topic.key, {
      subscribers: topic.subscribers,
    });

    await novu.topics.delete(topic.key);
  } catch (error: unknown) {
    console.error(error);
  }
}

/**
 * Get topics
 * @param numOfTopics - the number of topics per page
 * @returns an array of Topic objects
 */
export async function getTopics(numOfTopics: number): Promise<Topic[]> {
  const options = {
    method: 'GET',
    headers: { Authorization: `ApiKey ${NOVU_API_KEY}` },
    pageSize: numOfTopics,
  };

  const topics = await fetch('https://api.novu.co/v1/topics', options)
    .then((response) => response.json())
    .then((response) => response.data)
    .catch((err) => {
      console.error(err);
      return { error: `Could not retrieve topics.` };
    });

  return topics;
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
    console.error((error as Error).message);
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
   * Sends a notification to a user when the admin accepts their request to join a neighborhood.
   * @param subscriberId (string) - subscriberId of the user who joined
   * @param neighborhoodId (string) - the id of the joined neighborhood
   * @param neighborhoodName (string) - the name of the joined neighborhood
   */
  async joinReqAccepted(subscriberId: string, neighborhoodId: string, neighborhoodName: string) {
    try {
      novu.trigger('join-accepted', {
        to: {
          subscriberId,
        },
        payload: {
          neighborhoodName,
          neighborhoodId,
        },
      }).then(res => console.log(res.data))
    } catch (error: unknown) {
      console.error('Failed to trigger join-accepted notification', error);
    }
  },
  /**
   * Sends a notification to the requester when a user responds to them.
   * @param requestId (string) - id of the new request
   * @param actorId (string) - the subscriber id of the user who made the request
   * @param neighborhoodId (string) - the id of the neighborhood the request was created in
   */
  async createRequest(requestId: string, actorId: string, neighborhoodId: string) {
    try {
      const topicKey = `neighborhood:${neighborhoodId}`;
      await novu.trigger('create-request', {
        to: [{ type: TriggerRecipientsTypeEnum.TOPIC, topicKey }],
        actor: { subscriberId: actorId },
        payload: {
          requestId,
        },
      });
    } catch (error: unknown) {
      console.error('Failed to trigger create-request notification', error);
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
  /**
   * Sends a notification to the respondee when their response got accepted.
   * @param responseId (string) - id of the accepted response
   * @param requestId (number) - id of the request the user responded to
   * @param actorId (string) - the subscriber id of the user who created the request
   */
  async responseAccepted(responseId: string, requestId: number, actorId: string) {
    try {
      const response = await responseServices.getResponseById(+responseId);
      const subscriberId = String(response.user_id);

      await novu.trigger('response-accepted', {
        to: {
          subscriberId,
        },
        payload: {
          requestId,
        },
        actor: {
          subscriberId: actorId,
        },
      });
    } catch (error: unknown) {
      console.error('Failed to trigger response-accepted notification', error);
    }
  },
};
