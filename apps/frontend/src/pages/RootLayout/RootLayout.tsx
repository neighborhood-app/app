import { Outlet } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import styles from './RootLayout.module.css';

import MainNav from '../../components/MainNavigation/MainNav';

const RootLayout = () => (
  <Container fluid className={styles.container}>
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
  </Container>
);

export default RootLayout;
