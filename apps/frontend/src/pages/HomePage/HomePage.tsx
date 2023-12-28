import { useState } from 'react';
import { useLoaderData, ActionFunctionArgs } from 'react-router';
import { UserWithRelatedData } from '@neighborhood/backend/src/types';
import { Container, Row, Col } from 'react-bootstrap';
import neighborhoodServices from '../../services/neighborhoods';

import CustomBtn from '../../components/CustomBtn/CustomBtn';
import NeighborhoodCard from '../../components/NeighborhoodCard/NeighborhoodCard';
import CreateNeighborhoodModal from '../../components/CreateNeighborhoodModal/CreateNeighborhoodModal';
import styles from './HomePage.module.css';
import { getStoredUser } from '../../utils/auth';

import userServices from '../../services/users';
import Request from '../../components/Request/Request';
import { CreateNeighborhoodData } from '../../types';

export async function loader() {
  const user = getStoredUser();
  if (!user) return null;
  const userData = await userServices.getUserData(user.id);
  return userData;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const intent = formData.get('intent');
  formData.delete('intent');
  let response: Request | Response | { success: string } | { error: string } | null = null;

  if (intent === 'create-neighborhood') {
    const neighborhoodData = Object.fromEntries(formData) as unknown as CreateNeighborhoodData;
    response = await neighborhoodServices.createNeighborhood(neighborhoodData);
  }

  return response;
}

export default function HomePage() {
  const userData = useLoaderData() as unknown as UserWithRelatedData;
  const { neighborhoods } = userData;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const activeRequests = userData.requests.filter((request) => request.status === 'OPEN');
  const neighborhoodCards =
    neighborhoods.length === 0 ? (
      <p>You haven't joined any neighborhoods yet!</p>
    ) : (
      neighborhoods.map((neighborhood) => (
        <Col className="pe-0" sm="6" md="4" lg="3" key={neighborhood.id}>
          <NeighborhoodCard
            id={neighborhood.id}
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
        <h2>My neighborhoods</h2>
        <Container className="p-0 mb-4 mt-4" fluid>
          <Row className="me-0">
            <Col>
              <CustomBtn variant="primary" className={styles.button} onClick={handleShow}>
                Create neighborhood
              </CustomBtn>
            </Col>
          </Row>
          <Row className="mt-1 me-0 gy-sm-4 gx-xl-5 gx-sm-4 justify-content-start">
            {neighborhoodCards}
          </Row>
        </Container>
      </section>

      <section>
        <h2>My active requests</h2>
        <Container className="p-0 mb-4" fluid>
          <Row className="mt-1 me-0 gy-sm-4 gx-xl-5 gx-sm-4 justify-content-start">
            {activeRequests.length > 0 ? (
              activeRequests.map((request) => {
                if (request.status === 'OPEN') {
                  return (
                    <Col
                      className={`${styles.requestCol} pe-0`}
                      sm="6"
                      md="4"
                      lg="3"
                      key={request.id}>
                      <Request requestObj={request} />
                    </Col>
                  );
                }
                return null;
              })
            ) : (
              <p>You don't have any active requests at the moment.</p>
            )}
          </Row>
        </Container>
      </section>
      <CreateNeighborhoodModal show={show} handleClose={handleClose} />
    </div>
  );
}
