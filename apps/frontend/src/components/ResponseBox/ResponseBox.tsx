import styles from './ResponseBox.module.css';
import { ResponseWithUser } from "../../types"

type Props = {
  response: ResponseWithUser;
}

export default function ResponseBox({ response }: Props) {
  const date = String(response.time_created).split("T")[0];
  const status = response.status;

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
      <div>
        <p className={styles.p}>You've accepted this offer for help.</p>
        <p className={styles.p}>Contact at: <span>jane.parker@gmail.com</span></p>
      </div>
    </div>
  )
}