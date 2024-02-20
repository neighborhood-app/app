import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
  useParams,
  useActionData,
} from 'react-router';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Request, CreateRequestData } from '@neighborhood/backend/src/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import { AxiosError } from 'axios';
import notificationService from '../../services/notifications';
import neighborhoodService from '../../services/neighborhoods';
import requestService from '../../services/requests';

import {
  EditNeighborhoodData,
  NeighborhoodDetailsForMembers,
  NeighborhoodType,
  SingleNeighborhoodFormIntent,
  UserRole,
  FormIntent,
  ErrorObj,
} from '../../types';
import styles from './SingleNeighborhoodPage.module.css';
import DescriptionBox from '../../components/DescriptionBox/DescriptionBox';
import RequestBox from '../../components/RequestBox/RequestBox';
import Prompt from '../../components/Prompt/Prompt';
import MapBox from '../../components/MapBox/MapBox';
import UserCircleStack from '../../components/UserCircleStack/UserCircleStack';
import AlertBox from '../../components/AlertBox/AlertBox';

import { getStoredUser } from '../../utils/auth';

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const neighborhood = await neighborhoodService.getSingleNeighborhood(Number(id));

  return neighborhood;
}

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const neighborhoodId = Number(params.id);

  const intent = formData.get('intent') as SingleNeighborhoodFormIntent;
  formData.delete('intent');
  // We should consider only returning success/error objects from all routes
  // where we don't need the new data
  let response: Request | Response | { success: string } | ErrorObj | null = null;

  if (intent === 'create-request') {
    const requestData = Object.fromEntries(formData) as unknown as CreateRequestData;
    requestData.neighborhood_id = neighborhoodId;
    response = await requestService.createRequest(requestData);
    notificationService.createRequest(response.id, neighborhoodId).catch(console.error);
  } else if (intent === 'join-neighborhood') {
    response = await notificationService.joinNeighborhood(neighborhoodId);
  } else if (intent === 'leave-neighborhood') {
    response = await neighborhoodService.leaveNeighborhood(neighborhoodId);
  } else if (intent === 'edit-neighborhood') {
    const neighborhoodData = Object.fromEntries(formData) as unknown as EditNeighborhoodData;
    try {
      response = await neighborhoodService.editNeighborhood(neighborhoodId, neighborhoodData);
    } catch (error) {
      return error;
    }
  } else if (intent === 'delete-neighborhood') {
    response = await neighborhoodService.deleteNeighborhood(neighborhoodId);
  }

  return response;
}

const neighborhoodImg = require('./palm.jpeg');

export default function SingleNeighborhood() {
  interface PromptDetails {
    show: boolean;
    text: string;
    intent: FormIntent;
  }

  const mql = window.matchMedia('(max-width: 768px)');
  const [smallDisplay, setSmallDisplay] = useState(mql.matches);

  mql.addEventListener('change', () => {
    setSmallDisplay(mql.matches);
  });

  const { id: neighborhoodId } = useParams();

  const [promptDetails, setPromptDetails] = useState<PromptDetails>({
    show: false,
    text: '',
    intent: 'leave-neighborhood',
  });

  const errorObj = useActionData() as AxiosError;

  const [error, setError] = useState<ErrorObj | null>(null);

  useEffect(() => {
    if (errorObj) {
      setError(errorObj.response?.data as ErrorObj);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [errorObj]);

  function handleClosePrompt() {
    setPromptDetails((previousState) => ({ ...previousState, show: false }));
  }

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

  function handleLeavePrompt() {
    setPromptDetails({
      show: true,
      text: 'Are you sure you want to leave this neighborhood?',
      intent: 'leave-neighborhood',
    });
  }

  const user = getStoredUser();
  const neighborhoodData = useLoaderData() as NeighborhoodType;
  const neighborhoodLocation = neighborhoodData.location
    ? (neighborhoodData.location as unknown as SearchResult)
    : null;
  const userRole = checkLoggedUserRole(user?.username, neighborhoodData);

  let neighborhoodRequests;
  let usernames;

  if (checkForNeighborhoodDetails(neighborhoodData)) {
    neighborhoodRequests = neighborhoodData.requests;
    usernames = neighborhoodData.users?.map((user) => user.username);
  } else {
    neighborhoodRequests = null;
  }

  return (
    <Container className={styles.wrapper} fluid>
      {error && <AlertBox text={error.error} variant="danger"></AlertBox>}
      <Prompt
        text={promptDetails.text}
        intent={promptDetails.intent}
        route={`/neighborhoods/${neighborhoodId}`}
        status={promptDetails.show}
        handleClose={handleClosePrompt}
      />
      <Row className="align-items-center gy-3">
        <Col xs="auto">
          <Image
            className={styles.neighborhoodImg}
            roundedCircle
            src={neighborhoodImg}
            alt="Neighborhood"></Image>
        </Col>
        <Col xs="auto" sm="auto" className={styles.nameColumn}>
          <h1 className={styles.neighborhoodName}>{neighborhoodData.name}</h1>
        </Col>
        <Col
          xs="12"
          md="2"
          className={`${styles.membersContainer} justify-content-md-end ms-md-auto ms-3 pe-0`}>
          {userRole !== 'NON-MEMBER' ? <UserCircleStack usernames={usernames} /> : null}
          {userRole === 'MEMBER' ? (
            <FontAwesomeIcon
              icon={faDoorOpen}
              size="xl"
              className={styles.leaveIcon}
              onClick={handleLeavePrompt}
            />
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col className="d-flex flex-column justify-content-around">
          <DescriptionBox
            userRole={userRole}
            name={neighborhoodData.name}
            description={neighborhoodData.description ? neighborhoodData.description : ''}
            location={neighborhoodLocation}
            setPromptDetails={setPromptDetails}
          />
          {neighborhoodLocation && smallDisplay ? (
            <Col xs={'auto'} className={styles.centeredColumn}>
              <MapBox coordinates={{ lat: neighborhoodLocation.y, lng: neighborhoodLocation.x }} />
            </Col>
          ) : null}
          <h2 className={styles.title}>Neighborhood Requests</h2>
        </Col>
        {neighborhoodLocation && !smallDisplay ? (
          <Col xs={6} className={styles.centeredColumn}>
            <MapBox coordinates={{ lat: neighborhoodLocation.y, lng: neighborhoodLocation.x }} />
          </Col>
        ) : null}
      </Row>
      <Row>{<RequestBox requests={neighborhoodRequests} />}</Row>
    </Container>
  );
}
