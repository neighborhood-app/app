import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import ErrorContext from '../../store/error-context';
import styles from './RootLayout.module.css';

import MainNav from '../../components/MainNavigation/MainNav';
import AlertBox from '../../components/AlertBox/AlertBox';

const RootLayout = () => {
  const [error, setError] = useState('');

  function showError(errorMsg: string) {
    setError(errorMsg);
    setTimeout(() => {
      setError('');
    }, 1000);
  }

  return (
    <Container fluid>
      <ErrorContext.Provider value={showError}>
        {error && <AlertBox text={'Test'} variant="danger" className={styles.alert}></AlertBox>}
        <Row>
          <Col className={`${styles.column} ${styles.sticky}`} sm="auto">
            <MainNav />
          </Col>
          <Col className={styles.column}>
            <main>
              <Outlet />
            </main>
          </Col>
        </Row>
      </ErrorContext.Provider>
    </Container>
  );
};

export default RootLayout;
