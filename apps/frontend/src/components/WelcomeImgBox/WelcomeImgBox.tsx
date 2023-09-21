import styles from './WelcomeImgBox.module.css';
import { Col } from 'react-bootstrap';

export default function WelcomeImgBox({ className }: {className: string}) {
  return (
    <Col lg={6} className={className}>
      <div className={styles.imgDiv}></div>
      <h2 className={styles.welcomeHeading}>
        <span className={styles.textBackground}>Welcome!</span>
      </h2>
      <p className={'px-3 px-lg-1 px-xl-0'}>
      <span className={styles.textBackground}>
        Connect with your neighbors. Share resources. Build a strong community.
        </span>
      </p>
    </Col>
  );
}