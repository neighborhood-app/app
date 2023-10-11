import styles from './ResponseBox.module.css';
import { ResponseWithUserAndRequest } from "../../types"
import { useParams } from 'react-router';
import { getStoredUser } from '../../utils/auth';
import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';

type Props = {
  response: ResponseWithUserAndRequest;
  requestOwnerId: number;
}

function isLoggedUserRequestOwner(userId: number, requestOwnerId: number) {
  return userId === requestOwnerId;
};

function isLoggedUserResponseOwner(userId: number, responseOwnerId: number) {
  return userId === responseOwnerId;
}

export default function ResponseBox({ response, requestOwnerId }: Props) {
  const { id: neighborhoodId } = useParams();

  let loggedUser = getStoredUser();
  let loggedUserId = loggedUser ? Number(loggedUser.id) : null;

  const date = String(response.time_created).split("T")[0];

  function displayContactInfo() {
    if (!loggedUserId) return;

    const requestOwner = isLoggedUserRequestOwner(loggedUserId, requestOwnerId);
    const responseOwner = isLoggedUserResponseOwner(loggedUserId, response.user_id); 

    if (!(requestOwner || responseOwner)) return null;

    if (requestOwner) {
      if (response.status === "ACCEPTED") {
        return (
          <>
            <p className={styles.p}>You've accepted this offer for help.</p>
            <p className={styles.p}>Contact at: <span>{response.user.email}</span></p>
          </>
        )
      } else {
        return (
          <TriggerActionButton id={response.id} route={`/neighborhoods/${neighborhoodId}`} intent='accept-offer' text='Accept offer'/>
        )
      }
    } else if (responseOwner) {
      if (response.status === "ACCEPTED") {
        return (
          <>
            <p className={styles.p}>Your help offer has been accepted.</p>
            <TriggerActionButton id={response.id} route={`/neighborhoods/${neighborhoodId}`} intent='delete-response' text='Delete response'/>
          </>
        )
      } else {
        return (
          <TriggerActionButton id={response.id} route={`/neighborhoods/${neighborhoodId}`} intent='delete-response' text='Delete response'/>
        )
      }
    }
  }
  const contactInfo = displayContactInfo();

  return (
    <div className={styles.responseCard}>
      <div className={styles.profileAndDate}>
        <div className={styles.profileInfo}>
          <img
            className={styles.profileImg}
            src={require('./images/profile.jpg')}
            alt="active user on neighborhood app" />
          <p className={styles.p}>{response.user.username}</p>
        </div>
        <p className={styles.createdDate}>{date}</p>
      </div>
      <p className={styles.p}>
        {response.content}
      </p>
      <hr className={styles.hr} />
      <div className={styles.contact}>
        {contactInfo}
      </div>
    </div>
  )
}