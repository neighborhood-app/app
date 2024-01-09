import { ActionFunctionArgs, LoaderFunctionArgs, useLoaderData, useParams } from 'react-router';
import { useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Request, CreateRequestData } from '@neighborhood/backend/src/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import neighborhoodsService from '../../services/neighborhoods';
import requestServices from '../../services/requests';
import {
  EditNeighborhoodData,
  NeighborhoodDetailsForMembers,
  NeighborhoodType,
  SingleNeighborhoodFormIntent,
  UserRole,
  FormIntent,
} from '../../types';
import styles from './SingleNeighborhoodPage.module.css';
import DescriptionBox from '../../components/DescriptionBox/DescriptionBox';
import RequestBox from '../../components/RequestBox/RequestBox';
import Prompt from '../../components/Prompt/Prompt';
import MapBox from '../../components/MapBox/MapBox';
import UserCircleStack from '../../components/UserCircleStack/UserCircleStack';

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
  interface PromptDetails {
    show: boolean;
    text: string;
    intent: FormIntent;
  }

  const { id: neighborhoodId } = useParams();

  // const mql = window.matchMedia('(max-width: 800px)');

  // const [smallDisplay, setSmallDisplay] = useState(mql.matches);

  const [promptDetails, setPromptDetails] = useState<PromptDetails>({
    show: false,
    text: '',
    intent: 'leave-neighborhood',
  });

  // mql.addEventListener('change', () => {
  //   setSmallDisplay(mql.matches);
  // });

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
        <Col xs="12" sm="auto">
          <h1>{neighborhoodData.name}</h1>
        </Col>
        <Col
          xs="12"
          md="2"
          className={`${styles.membersContainer} justify-content-md-end ms-md-auto ms-3 pe-0`}>
          {userRole !== 'NON-MEMBER' ? <UserCircleStack usernames={usernames} /> : null}
          {userRole === 'MEMBER' ? (
            <FontAwesomeIcon
              icon={faDoorOpen}
              size="2xl"
              className={styles.leaveIcon}
              onClick={handleLeavePrompt}
            />
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col className={styles.centeredColumn}>
          <DescriptionBox
            userRole={userRole}
            name={neighborhoodData.name}
            description={neighborhoodData.description ? neighborhoodData.description : ''}
            location={neighborhoodLocation}
            setPromptDetails={setPromptDetails}
          />
        </Col>
        {neighborhoodLocation ? (
          <Col xs={6} className={styles.centeredColumn}>
            <MapBox coordinates={{ lat: neighborhoodLocation.y, lng: neighborhoodLocation.x }} />
          </Col>
        ) : null}
      </Row>
      <Row>{<RequestBox requests={neighborhoodRequests} />}</Row>
    </Container>
  );
}
