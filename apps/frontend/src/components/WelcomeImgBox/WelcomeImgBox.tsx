import styles from './WelcomeImgBox.module.css';
import { Col, Image } from 'react-bootstrap';

export default function WelcomeImgBox({ className }: {className: string}) {
  return (
    <Col lg={6} className={className}>
      <Image className={styles.neighborhoodImg} src={require('../../assets/neighborhood2.jpeg')} rounded fluid></Image>
      <h2 className={styles.welcomeHeading}>Welcome!</h2>
      <p>Connect with your neighbors. Share resources. Build a strong community.</p>
    </Col>
  );
}