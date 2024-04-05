import { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Link, useActionData } from 'react-router-dom';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import WelcomeImgBox from '../../components/WelcomeImgBox/WelcomeImgBox';
import AlertBox from '../../components/AlertBox/AlertBox';
import signUp from '../../services/signUp';
import { ErrorObj, SignUpData } from '../../types';
import styles from './SignUpPage.module.css';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const signUpData = Object.fromEntries(formData) as unknown as SignUpData;

  const signUpRes = await signUp(signUpData);
  return signUpRes;
}

export default function SignUpPage() {
  const [error, setError] = useState<ErrorObj | null>(null);
  const signUpRes = useActionData() as Response | ErrorObj;

  useEffect(() => {
    if (signUpRes && 'error' in signUpRes) {
      setError(signUpRes);
    }

    setTimeout(() => {
      setError(null);
    }, 6000);
  }, [signUpRes]);

  return (
    <Container className={styles.wrapper} fluid>
      <Row className={styles.headerRow}>
        <Link to="/landing">
          <div className={styles.logo}>
            <i className="fa-solid fa-people-roof"></i>
            <span>Neighbourhood</span>
          </div>
        </Link>
      </Row>
      <Row className={styles.customRow}>
        {error && (
          <AlertBox className={styles.alertBox} text={error.error} variant="danger"></AlertBox>
        )}
        <WelcomeImgBox className={`${styles.customCol} ${styles.imgCol}`}></WelcomeImgBox>
        <SignUpForm className={`${styles.customCol} ${styles.formWrapper}`}></SignUpForm>
      </Row>
    </Container>
  );
}
