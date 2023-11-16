import { useLoaderData } from 'react-router';
import { UserWithRelatedData } from '@neighborhood/backend/src/types';

import { Container, Row, Col } from 'react-bootstrap';
import NeighborhoodCard from '../../components/NeighborhoodCard/NeighborhoodCard';

import styles from './HomePage.module.css';
import { getStoredUser } from '../../utils/auth';

import userServices from '../../services/users';
import Request from '../../components/Request/Request';

// const neighborhoodImg1 = require('./images/palm-tree.jpeg');
// const neighborhoodImg2 = require('./images/up-north.jpg');

export async function loader() {
  const user = getStoredUser();
  if (!user) return null;
  const userData = await userServices.getUserData(user.id);
  return userData;
}

export default function HomePage() {
  const userData = useLoaderData() as unknown as UserWithRelatedData;
  const { neighborhoods } = userData;
  const neighborhoodCards =
    neighborhoods.length === 0 ? (
      <p>You haven't joined any neighborhoods yet!</p>
    ) : (
      neighborhoods.map((neighborhood) => (
        <Col className="pe-0" sm="6" md="4" lg="3">
          <NeighborhoodCard
            id={String(neighborhood.id)}
            name={neighborhood.name}
            description={neighborhood.description}
            isUserAdmin={neighborhood.admin_id === userData.id}
          />
        </Col>
      ))
    );

  return (
    <div className={styles.wrapper}>
      <section>
        <h1>My neighborhoods</h1>
        <Container className="p-0 mb-4" fluid>
          <Row className="mt-1 me-0 gy-sm-4 gx-xl-5 gx-sm-4 justify-content-start">
            {neighborhoodCards}
          </Row>
        </Container>
      </section>

      <section>
        <h1>My active requests</h1>
        <Container className="p-0 mb-4" fluid>
          <Row className="mt-1 me-0 gy-sm-4 gx-xl-5 gx-sm-4 justify-content-start">
            {userData.requests.length > 0 ? (
              userData.requests.map((request) => {
                if (request.status === "OPEN") {
                  return (<Col className={`${styles.requestCol} pe-0`} sm="6" md="4" lg="3">
                  <Request requestObj={request} />
                </Col>)
                }
                return <p>You don't have any active requests at the moment.</p>;         
            })
            ) : (
              <p>You haven't created any requests yet!</p>
            )}
          </Row>
        </Container>
      </section>
    </div>
  );
}
