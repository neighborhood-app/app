import styles from './ResponseBox.module.css';
import { ResponseWithUser } from "../../types"
import acceptResponse from "../../services/responses";
import { useRevalidator } from 'react-router';
import CustomBtn from '../CustomBtn/CustomBtn';

type Props = {
  response: ResponseWithUser;
}

export default function ResponseBox({ response }: Props) {
  const revalidator = useRevalidator();
  console.log(response);

  let user = localStorage.getItem('user');
  let username = user ? JSON.parse(user).username : null;

  const date = String(response.time_created).split("T")[0];
  function handleAcceptOffer() {
    acceptResponse(String(response.id));
    revalidator.revalidate();
  }

  //if response status is ACCEPTED and logged in username === response.request owner username
  const contactInfo = response.status === "ACCEPTED" ? (
    <div>
      <p className={styles.p}>You've accepted this offer for help.</p>
      <p className={styles.p}>Contact at: <span>{response.user.email}</span></p>
    </div>
  ) : <CustomBtn variant='outline-dark' className={styles.btn} onClick={handleAcceptOffer}>Accept Offer</CustomBtn>;

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