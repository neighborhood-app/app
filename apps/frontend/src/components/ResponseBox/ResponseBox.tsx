import styles from './ResponseBox.module.css';
import { ResponseWithUser } from "../../types"
import acceptResponse from "../../services/responses";
import { useRevalidator } from 'react-router';
import SubmitBtn from '../SubmitButton/SubmitBtn';

type Props = {
  response: ResponseWithUser;
}

export default function ResponseBox({ response }: Props) {
  const revalidator = useRevalidator();

  const date = String(response.time_created).split("T")[0];
  function handleAcceptOffer() {
    acceptResponse(String(response.id));
    revalidator.revalidate();
  }

  const contactInfo = response.status === "ACCEPTED" ? (
    <div>
      <p className={styles.p}>You've accepted this offer for help.</p>
      <p className={styles.p}>Contact at: <span>{response.user.email}</span></p>
    </div>
  ) : <SubmitBtn className={styles.btn} onClick={handleAcceptOffer}>Accept Offer</SubmitBtn>;

  return (
    <div className={styles.responseCard}>
      <div className={styles.profileAndDate}>
        <div className={styles.profileInfo}>
          <img
            className={styles.profileImg}
            src={require('./images/profile.jpg')}
            alt="active user on neighborhood app" />
          <p className={styles.p}>Jane Parker</p>
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