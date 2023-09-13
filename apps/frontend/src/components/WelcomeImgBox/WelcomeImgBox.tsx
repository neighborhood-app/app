import styles from './WelcomeImgBox.module.css';
import { Col } from 'react-bootstrap';

export default function WelcomeImgBox({ className }: {className: string}) {
  return (
    <Col lg={6} className={className}>
      <div className={styles.imgDiv}></div>
      <h2 className={styles.welcomeHeading}>Welcome!</h2>
      <p className={'px-3 px-lg-1 px-xl-0'}>Connect with your neighbors. Share resources. Build a strong community.</p>
    </Col>
  );
}