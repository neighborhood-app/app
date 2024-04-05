import { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { redirect, useActionData } from 'react-router';
import { Link } from 'react-router-dom';
import { LoginData } from '@neighborhood/backend/src/types';
import { ErrorObj, UserInfo } from '../../types';
import LoginForm from '../../components/LoginForm/LoginForm';
import WelcomeImgBox from '../../components/WelcomeImgBox/WelcomeImgBox';
import login from '../../services/login';
import styles from './LoginPage.module.css';
import AlertBox from '../../components/AlertBox/AlertBox';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const loginData = Object.fromEntries(formData) as unknown as LoginData;
  const loginResponse: UserInfo | ErrorObj = await login(loginData);

  if ('error' in loginResponse) {
    return loginResponse;
  } else if ('username' in loginResponse) {
    window.localStorage.setItem('user', JSON.stringify(loginResponse));
    return redirect('/');
  }

  return null;
}

export default function LoginPage() {
  const [error, setError] = useState<ErrorObj | null>(null);
  const loginResponse = useActionData() as Response | ErrorObj;

  useEffect(() => {
    if (loginResponse && 'error' in loginResponse) {
      setError(loginResponse);
    }

    setTimeout(() => {
      setError(null);
    }, 6000);
  }, [loginResponse]);

  return (
    <Container className={styles.wrapper} fluid>
      <Row className={styles.headerRow}>
        <Link className={styles.logoLink} to="/landing">
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
        <LoginForm className={`${styles.customCol} ${styles.formWrapper}`}></LoginForm>
      </Row>
    </Container>
  );
}
