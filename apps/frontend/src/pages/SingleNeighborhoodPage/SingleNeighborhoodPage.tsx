import { ActionFunctionArgs, LoaderFunctionArgs, useLoaderData } from 'react-router';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Request, CreateRequestData } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import requestServices from '../../services/requests';
import {
  EditNeighborhoodData,
  NeighborhoodDetailsForMembers,
  NeighborhoodType,
  SingleNeighborhoodFormIntent,
  UserRole,
} from '../../types';
import styles from './SingleNeighborhoodPage.module.css';
import DescriptionBox from '../../components/DescriptionBox/DescriptionBox';
import RequestBox from '../../components/RequestBox/RequestBox';
import MapBox from '../../components/MapBox/MapBox';
import { getStoredUser } from '../../utils/auth';

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const neighborhood = await neighborhoodsService.getSingleNeighborhood(Number(id));

  return neighborhood;
}

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const neighborhoodId = Number(params.id);

  const intent = formData.get('intent') as SingleNeighborhoodFormIntent;
  formData.delete('intent');
  // We should consider only returning success/error objects from all routes
  // where we don't need the new data
  let response: Request | Response | { success: string } | { error: string } | null = null;

  if (intent === 'create-request') {
    const requestData = Object.fromEntries(formData) as unknown as CreateRequestData;
    requestData.neighborhood_id = neighborhoodId;
    response = await requestServices.createRequest(requestData);
  } else if (intent === 'join-neighborhood') {
    response = await neighborhoodsService.connectUserToNeighborhood(neighborhoodId);
  } else if (intent === 'leave-neighborhood') {
    response = await neighborhoodsService.leaveNeighborhood(neighborhoodId);
  } else if (intent === 'edit-neighborhood') {
    const neighborhoodData = Object.fromEntries(formData) as unknown as EditNeighborhoodData;
    response = await neighborhoodsService.editNeighborhood(neighborhoodId, neighborhoodData);
  } else if (intent === 'delete-neighborhood') {
    response = await neighborhoodsService.deleteNeighborhood(neighborhoodId);
  }

  return response;
}

const neighborhoodImg = require('./palm.jpeg');

export default function SingleNeighborhood() {
  const checkForNeighborhoodDetails = (
    neighborhood: NeighborhoodType,
  ): neighborhood is NeighborhoodDetailsForMembers => Object.hasOwn(neighborhood, 'admin');

  function checkLoggedUserRole(
    userName: string | undefined,
    neighborhood: NeighborhoodType,
  ): UserRole {
    if (checkForNeighborhoodDetails(neighborhood)) {
      return neighborhood.admin.username === userName ? 'ADMIN' : 'MEMBER';
    }
    return 'NON-MEMBER';
  }

  const user = getStoredUser();
  const neighborhoodData = useLoaderData() as NeighborhoodType;
  const userRole = checkLoggedUserRole(user?.username, neighborhoodData);

  let neighborhoodUsers;
  let neighborhoodRequests;

  if (checkForNeighborhoodDetails(neighborhoodData)) {
    neighborhoodUsers = neighborhoodData.users;
    neighborhoodRequests = neighborhoodData.requests;
  } else {
    neighborhoodUsers = null;
    neighborhoodRequests = null;
  }

  return (
    <Container className={styles.wrapper} fluid>
      <Row className="align-items-center gy-3">
        <Col xs="auto">
          <Image
            className={styles.neighborhoodImg}
            roundedCircle
            src={neighborhoodImg}
            alt="Neighborhood"></Image>
        </Col>
        <Col xs="12" sm="auto">
          <h1>{neighborhoodData.name}</h1>
        </Col>
        <Col className="d-flex justify-content-end">
          <p>Test</p>
        </Col>
      </Row>
      <Row>
        <DescriptionBox
          userRole={userRole}
          name={neighborhoodData.name}
          description={neighborhoodData.description ? neighborhoodData.description : ''}
          users={neighborhoodUsers}
        />
      </Row>
      <Row>
        <MapBox />
      </Row>
      <Row>{<RequestBox requests={neighborhoodRequests} />}</Row>
    </Container>
  );
}
