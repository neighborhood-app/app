import { useParams } from 'react-router';
import styles from './ResponseBox.module.css';
import { ResponseWithUserAndRequest } from '../../types';
import { getStoredUser } from '../../utils/auth';
import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';

const profilePic = require('./images/profile.jpg');

type Props = {
  response: ResponseWithUserAndRequest;
  requestOwnerId: number;
};

function isLoggedUserRequestOwner(userId: number, requestOwnerId: number) {
  return userId === requestOwnerId;
}

function isLoggedUserResponseOwner(userId: number, responseOwnerId: number) {
  return userId === responseOwnerId;
}

export default function ResponseBox({ response, requestOwnerId }: Props) {
  const { id: neighborhoodId } = useParams();

  const loggedUser = getStoredUser();
  const loggedUserId = loggedUser ? Number(loggedUser.id) : null;

  const date = String(response.time_created).split('T')[0];

  function displayContactInfo() {
    if (!loggedUserId) return null;

    const requestOwner = isLoggedUserRequestOwner(loggedUserId, requestOwnerId);
    const responseOwner = isLoggedUserResponseOwner(loggedUserId, response.user_id);

    if (requestOwner) {
      if (response.status === 'ACCEPTED') {
        return (
          <>
            <p className={styles.p}>You've accepted this offer for help.</p>
            <p className={styles.p}>
              Contact at: <span>{response.user.email}</span>
            </p>
          </>
        );
      }

      return (
        <TriggerActionButton
          id={response.id}
          route={`/neighborhoods/${neighborhoodId}`}
          intent="accept-offer"
          text="Accept offer"
        />
      );
    } else if (responseOwner) {
      if (response.status === 'ACCEPTED') {
        return (
          <>
            <p className={styles.p}>Your help offer has been accepted.</p>
            <TriggerActionButton
              id={response.id}
              route={`/neighborhoods/${neighborhoodId}`}
              intent="delete-response"
              text="Delete response"
            />
          </>
        );
      }

      return (
        <TriggerActionButton
          id={response.id}
          route={`/neighborhoods/${neighborhoodId}`}
          intent="delete-response"
          text="Delete response"
        />
      );
    }

    return null;
  }
  const contactInfo = displayContactInfo();

  return (
    <div className={styles.responseCard}>
      <div className={styles.profileAndDate}>
        <div className={styles.profileInfo}>
          <img
            className={styles.profileImg}
            src={profilePic}
            alt="active user on neighborhood app"
          />
          <p className={styles.p}>{response.user.username}</p>
        </div>
        <p className={styles.createdDate}>{date}</p>
      </div>
      <p className={styles.p}>{response.content}</p>
      <hr className={styles.hr} />
      <div className={styles.contact}>{contactInfo}</div>
    </div>
  );
}
