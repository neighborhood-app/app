import { Novu, TriggerRecipientsTypeEnum } from '@novu/node';
import { createHmac } from 'crypto';
import {
  JoinNeighborhoodArgs,
  Notification,
  NotificationFilterData,
  Request,
  Subscriber,
  Topic,
} from '../types';
import requestServices from './requestServices';
import responseServices from './responseServices';

const NOVU_API_KEY = process.env.NOVU_API_KEY || '';
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
 * @param id to use as subscriberId
 * @param username
 * @param firstName
 * @param lastName
 * @param imageURL (optional) to use as the user's avatar
 */
export async function createSubscriber(
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  imageURL?: string,
) {
  try {
    await novu.subscribers.identify(id, {
      firstName,
      lastName,
      avatar: imageURL,
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
 * Updates a subscriber's info
 * @param subscriberId
 */
export async function updateSubscriber({
  subscriberId,
  firstName,
  lastName,
  email,
  avatar,
}: {
  subscriberId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}) {
  try {
    // If none of the values were updated ('' or undefined), return immediately
    if ([firstName, lastName, email, avatar].every((val) => !val)) return;

    const subscriberInfo = { firstName, lastName, email, avatar };
    const options = {
      method: 'PUT',
      headers: { Authorization: `ApiKey ${NOVU_API_KEY}` },
      body: subscriberInfo as unknown as BodyInit,
    };

    // API currently doesn't work properly
    await fetch(`https://api.novu.co/v1/subscribers/${subscriberId}`, options)
      .then((response) => response.json())
      .then((response) => response.data)
      .catch((err) => {
        console.error(err);
        return { error: `Could not update subscriber ${subscriberId}.` };
      });

    // const res = await novu.subscribers.update(subscriberId, {
    //   firstName,
    //   lastName,
    //   email,
    //   avatar: imageUrl,
    // });
  } catch (error) {
    console.error(error);
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
 * Retrieves the last 100 subscriber notifications.
 * @param subscriberId (string) - the id of the subscriber
 * @returns an array of Notification objects
 */
function getSubscriberNotifications(subscriberId: string) {
  return novu.subscribers
    .getNotificationsFeed(subscriberId, {
      page: 0,
      limit: 100,
    })
    .then((res) =>
      res.data.data.map((notification: Notification) => ({
        status: notification.cta.action.status,
        userId: notification.payload.userId,
        neighborhoodId: notification.payload.neighborhoodId,
        templateIdentifier: notification.templateIdentifier,
      })),
    )
    .catch(console.error);
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
      /*
       * Checks if there is an identical notification in the recent history.
       * Note that this implementation only checks the first page of results
       * and not ALL the admin's notifications.
       */
      const notifications = await getSubscriberNotifications(adminId);

      const identicalNotification = notifications.some(
        (notification: NotificationFilterData) =>
          notification.status === 'pending' &&
          notification.userId === userId &&
          notification.neighborhoodId === neighborhoodId &&
          notification.templateIdentifier === 'join-neighborhood',
      );

      if (identicalNotification) return;

      await novu.trigger('join-neighborhood', {
        to: {
          subscriberId: adminId,
        },
        actor: {
          subscriberId: userId,
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
  joinReqAccepted(subscriberId: string, neighborhoodId: string, neighborhoodName: string) {
    novu
      .trigger('join-accepted', {
        to: {
          subscriberId,
        },
        payload: {
          neighborhoodName,
          neighborhoodId,
        },
      })
      .catch((error) => {
        console.error('Failed to trigger join-accepted notification', error);
      });
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
