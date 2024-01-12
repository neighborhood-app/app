import { Novu } from '@novu/node';

// MOVE KEY TO .env file
const novu = new Novu('9cc0a07918a5743da4558428c33d6558');

/**
 * Sends a notification to an admin when a user asks to join their neighborhood
 * @param id (string) - subscriberId of the user requesting to join
 * @param neighborhoodId (string) - the id of the neighborhood to join
 */
async function triggerJoinNhood(id: string, neighborhoodId: string) {
  try {
    const res = await novu.trigger('join-neighborhood', {
      to: {
        subscriberId: id,
      },
      payload: {
        description: `User ${id} wants to join neighborhood ${neighborhoodId}.`,
        neighborhoodId,
      },
    });

    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}

const notificationTriggers = {
  joinNeighborhood: triggerJoinNhood,
}

export default notificationTriggers;