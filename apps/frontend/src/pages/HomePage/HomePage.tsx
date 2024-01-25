import { useState } from 'react';
import { useLoaderData, useActionData, ActionFunctionArgs } from 'react-router';
import { UserWithRelatedData } from '@neighborhood/backend/src/types';
import { Container, Row, Col } from 'react-bootstrap';
import { AxiosError } from 'axios';
import neighborhoodServices from '../../services/neighborhoods';

import CustomBtn from '../../components/CustomBtn/CustomBtn';
import NeighborhoodCard from '../../components/NeighborhoodCard/NeighborhoodCard';
import NeighborhoodModalForm from '../../components/NeighborhoodModalForm/NeighborhoodModalForm';
import AlertBox from '../../components/AlertBox/AlertBox';
import styles from './HomePage.module.css';
import { getStoredUser } from '../../utils/auth';

import userServices from '../../services/users';
import Request from '../../components/Request/Request';
import { CreateNeighborhoodData, ErrorObj } from '../../types';

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
    try {
      response = await neighborhoodServices.createNeighborhood(neighborhoodData);
    } catch (error) {
      return error;
    }
  }

  return response;
}

export default function HomePage() {
  const userData = useLoaderData() as unknown as UserWithRelatedData;
  const error = useActionData() as AxiosError;

  const errorResponse = error ? (error.response?.data as ErrorObj) : null;

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
      {errorResponse && <AlertBox text={errorResponse.error} variant="danger"></AlertBox>}
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
      <NeighborhoodModalForm
        show={show}
        handleClose={handleClose}
        intent="create-neighborhood"
        action="/"
      />
    </div>
  );
}
