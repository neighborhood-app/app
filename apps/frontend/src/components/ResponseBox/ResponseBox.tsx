import styles from './ResponseBox.module.css';
import { ResponseWithUserAndRequest } from "../../types"
import { acceptResponse, deleteResponse } from "../../services/responses";
import { useRevalidator } from 'react-router';
import CustomBtn from '../CustomBtn/CustomBtn';

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
  const revalidator = useRevalidator();

  let loggedUser = localStorage.getItem('user');
  let loggedUserId = loggedUser ? JSON.parse(loggedUser).id : null;

  const date = String(response.time_created).split("T")[0];

  function handleAcceptOffer() {
    acceptResponse(String(response.id));
    revalidator.revalidate();
  }

  function handleDeleteResponse() {
    deleteResponse(String(response.id));
    revalidator.revalidate();
  }

  /*
    Cases:
    1. User is not the response or request owner;
      Show nothing;
    2. User is also response owner:
      Show a delete and edit button;
      - if response status is ACCEPTED also show msg "You're response has been accepted"
    3. User is also request owner:
      Show a 'Accept offer' button;
      - if response status is ACCEPTED show contact info.
  */

  function displayContactInfo() {
    const requestOwner = isLoggedUserRequestOwner(loggedUserId, requestOwnerId);
    const responseOwner = isLoggedUserResponseOwner(loggedUserId, response.user_id);

    if (!(requestOwner || responseOwner)) {
      return null;
    } else if (requestOwner) {
      if (response.status === "ACCEPTED") {
        return (
          <>
            <p className={styles.p}>You've accepted this offer for help.</p>
            <p className={styles.p}>Contact at: <span>{response.user.email}</span></p>
          </>
        )
      } else {
        return (
          <CustomBtn variant='outline-dark' className={styles.btn} onClick={handleAcceptOffer}>Accept Offer</CustomBtn>
        )
      }
    } else if (responseOwner) {
      if (response.status === "ACCEPTED") {
        return (
          <>
            <p className={styles.p}>Your help offer has been accepted.</p>
            <CustomBtn variant='danger' className={`${styles.btn} ${styles.deleteResponseBtn}`} onClick={handleDeleteResponse}>Delete Response</CustomBtn>
          </>
        )
      } else {
        return (
          <CustomBtn variant='danger' className={`${styles.btn} ${styles.deleteResponseBtn}`} onClick={handleDeleteResponse}>Delete Response</CustomBtn>
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