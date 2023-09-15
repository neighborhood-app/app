import styles from './Response.module.css';

export default function Response() {
  return (
    <div className={styles.responseCard}>
      <div className={styles.profieAndDate}>
        <div className={styles.profileInfo}>
          <img
            src="images/profile-2.jpg"
            alt="active user on neighborhood app" />
          <p className={styles.p}>Jane Parker</p>
        </div>
        <p className={styles.createdDate}>Created 11 Mar 2022</p>
      </div>
      <p className={styles.p}>
        I can help out with your drowning cat. I've been a lifeguard for 5
        years and I know how to save a cat.
      </p>
      <hr />
      <div>
        <p className={styles.p}>You've accepted this offer for help.</p>
        <p className={styles.p}>Contact at: <span>jane.parker@gmail.com</span></p>
      </div>
    </div>
  )
}