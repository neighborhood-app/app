import { Outlet } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import Footer from '../../components/Footer/Footer';
import styles from './RootLayout.module.css';

import MainNav from '../../components/MainNavigation/MainNav';

const RootLayout = () => (
  <Container fluid>
    <Row>
      <Col className={`${styles.column} ${styles.sticky}`} sm="auto">
        <MainNav />
      </Col>
      <Col className={`${styles.column} ${styles.mainColumn}`}>
        <main>
          <Outlet />
        </main>
      </Col>
    </Row>
    <Row>
      <Footer />
    </Row>
  </Container>
);

export default RootLayout;
