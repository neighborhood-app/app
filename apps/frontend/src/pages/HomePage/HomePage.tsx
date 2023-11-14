import { Container, Row, Col } from 'react-bootstrap';
import NeighborhoodCard from '../../components/NeighborhoodCard/NeighborhoodCard';

import styles from "./HomePage.module.css"
import { getStoredUser } from '../../utils/auth';

// const neighborhoodImg1 = require('./images/palm-tree.jpeg');
// const neighborhoodImg2 = require('./images/up-north.jpg');

export async function loader() {
  const user = getStoredUser();
  console.log(user);
  return user;
}

export default function HomePage() {
  return (
    <div className={styles.wrapper}>
      <section>
        <h1>My neighborhoods</h1>
        <Container className="p-0" fluid>
          <Row className="mt-1 me-0 gy-sm-4 gx-xl-5 gx-sm-4 justify-content-start"> 
            <Col className='pe-0' sm="6" md="4" lg="3">
              <NeighborhoodCard />
            </Col>
            <Col className='pe-0' sm="6" md="4" lg="3">
              <NeighborhoodCard />
            </Col>
            <Col className='pe-0' sm="6" md="4" lg="3">
              <NeighborhoodCard />
            </Col>
            <Col className='pe-0' sm="6" md="4" lg="3">
              <NeighborhoodCard />
            </Col>
            <Col className='pe-0' sm="6" md="4" lg="3">
              <NeighborhoodCard />
            </Col>
            <Col className='pe-0' sm="6" md="4" lg="3">
              <NeighborhoodCard />
            </Col>
          </Row>
        </Container>
        
      </section>
      
      <section>
        <h1>My active requests</h1>
        <div className="all-active-requests">
          <div className="request-card">
            <img src="images/image.jpeg" alt="active request in neighborhood app" />

            <div className="request-card-content">
              <p>Help! My cat is drowning</p>
              <p>Created 11 Mar 2022 in Palm Springs Neighborhood</p>
              <p>2 responses</p>
            </div>
          </div>

          <div className="request-card">
            <img src="images/image.jpeg" alt="active requests on neighborhood app" />

            <div className="request-card-content">
              <p>Help with acute lazyness</p>
              <p>Created 12 Mar 2022 in Up North Neighborhood</p>
              <p>No responses</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h1>Requests I've responded to</h1>
        <div className="all-responded-requests">
          <div className="responded-request-card">
            <div className="profile-info">
              <img src="images/profile-2.jpg" alt="active user on neighborhood app" />
              <p>Laura Keith</p>
            </div>

            <img src="images/cat.jpg" alt="responded requests on neighborhood app" />

            <div className="responded-request-card-content">
              <p>Help! My cat is drowning</p>
              <p>Created 11 Mar 2022 in Palm Springs Neighborhood</p>
            </div>
          </div>

          <div className="responded-request-card">
            <div className="profile-info">
              <img src="images/profile.jpg" alt="active user on neighborhood app" />
              <p>John Smith</p>
            </div>

            <img src="images/request.jpeg" alt="responded requests on neighborhood app" />

            <div className="responded-request-card-content">
              <p>Meeting 20.02.2022</p>
              <p>Created 20 Feb 2022 in Palm Springs Neighborhood</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
