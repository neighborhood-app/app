// import { useParams } from 'react-router';
// import CustomBtn from '../CustomBtn/CustomBtn';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faBan, faCheck } from '@fortawesome/free-solid-svg-icons';
import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';
import styles from './RequestDescBox.module.css';
import { FullRequestData, StoredUserData } from '../../types';
import { getStoredUser } from '../../utils/auth';
import CustomBtn from '../CustomBtn/CustomBtn';
import CreateResponseModal from '../CreateResponseModal/CreateResponseModal';

const requestImg = require('../../assets/help_wanted.jpeg');

interface Props {
  request: FullRequestData;
}

export default function RequestDescBox({ request }: Props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { user, neighborhood } = request;
  const requestDate = request.time_created.split('T')[0];
  const requestStatusIcon =
    // eslint-disable-next-line no-nested-ternary
    request.status === 'CLOSED' ? (
      <FontAwesomeIcon className={styles.iconClosed} icon={faCheck} size="sm" />
    ) : request.status === 'INACTIVE' ? (
      <FontAwesomeIcon className={styles.iconInactive} icon={faBan} size="sm" />
    ) : null;

  let userName = '';

  if (user.first_name && user.last_name) userName = `${user.first_name} ${user.last_name}`;
  else userName = user.username;

  const loggedUser = getStoredUser() as StoredUserData;
  const { username, id: loggedUserId } = loggedUser;

  const hasUserResponded = request.responses.some(
    (response) => response.user_id === Number(loggedUserId),
  );

  const deleteBtnColumn = (
    <Col xl="2" md="3" sm="3" xs="7" className="p-0 ps-sm-2 me-md-5">
      <TriggerActionButton
        id={neighborhood.id}
        idInputName="neighborhoodId"
        route={`/requests/${request.id}`}
        variant="danger"
        intent="delete-request"
        text="Delete request"
        className={styles.actionBtn}
      />
    </Col>
  );

  /**
  * Based on the status of a user (creator, or viewer) and the status of the request 
  (OPEN or CLOSED) returns the corresponding JSX for the request modal.
  */
  const displayRequestActions = () => {
    if (username === request.user.username && request.status === 'OPEN') {
      return (
        <>
          <Col xl="2" md="3" sm="3" xs="7" className="p-0 ps-sm-2 me-sm-4 mb-2">
            <TriggerActionButton
              route={`/requests/${request.id}`}
              variant="primary"
              intent="close-request"
              text="Close request"
              className={styles.actionBtn}
            />
          </Col>
          {deleteBtnColumn}
        </>
      );
    } else if (username === request.user.username) {
      return deleteBtnColumn;
    } else if (request.status === 'OPEN' && !hasUserResponded) {
      return (
        <Col lg="2" sm="3" xs="7" className="p-0 ps-sm-2 me-md-5">
          <CustomBtn className={styles.actionBtn} variant="primary" onClick={handleShow}>
            Offer help
          </CustomBtn>
        </Col>
      );
    }

    return null;
  };

  return (
    <Container className="m-sm-3 mt-4" fluid>
      <Row className="mb-2 mt-sm-4">
        <Link to={`/neighborhoods/${neighborhood.id}`}>
          <FontAwesomeIcon className={styles.backIcon} icon={faAngleLeft} />
          <h5 className={styles.neighborhoodTitle}>{neighborhood.name}</h5>
        </Link>
      </Row>
      <Row className="gx-3">
        <Col sm="3">
          <Image className={styles.requestImg} rounded src={requestImg} alt="Request" />
          <p className={`${styles.requestDate} small`}>Created on {requestDate}</p>
        </Col>
        <Col className="me-sm-2">
          <h3>
            {request.title}
            {requestStatusIcon}
          </h3>
          <Link to="#">
            <Image className={styles.userIcon} roundedCircle src={requestImg} alt="Request" />
            <p className={`${styles.userName} text-muted`}>{userName}</p>
          </Link>
          <p>{request.content}</p>
        </Col>
      </Row>
      <Row className="mb-3 gx-3 justify-content-sm-start justify-content-center">
        <Col sm="3"></Col>
        {displayRequestActions()}
      </Row>
      <CreateResponseModal show={show} handleClose={handleClose} />
    </Container>
  );
}
