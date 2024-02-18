import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import WelcomeImgBox from '../../components/WelcomeImgBox/WelcomeImgBox';
import signUp from '../../services/signUp';
import { SignUpData } from '../../types';
import styles from './SignUpPage.module.css';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const signUpData = Object.fromEntries(formData) as unknown as SignUpData;

  await signUp(signUpData);

  return null;
}

export default function SignUpPage() {
  return (
    <Container className={styles.wrapper} fluid>
      <Row className={styles.headerRow}>
        <Link to="/landing">
          <div className={styles.logo}>
            <i className="fa-solid fa-people-roof"></i>
            <span>Neighborhood</span>
          </div>
        </Link>
      </Row>
      <Row className={styles.customRow}>
        <WelcomeImgBox className={`${styles.customCol} ${styles.imgCol}`}></WelcomeImgBox>
        <SignUpForm className={`${styles.customCol} ${styles.formWrapper}`}></SignUpForm>
      </Row>
    </Container>
  );
}
