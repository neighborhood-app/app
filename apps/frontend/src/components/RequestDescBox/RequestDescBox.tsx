// import { useParams } from 'react-router';
// import CustomBtn from '../CustomBtn/CustomBtn';
// import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';
// import { useState } from 'react';
import { Link, useSubmit } from 'react-router-dom';
import { Col, Container, Form, Image, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FormEvent } from 'react';
import styles from './RequestDescBox.module.css';
import { FullRequestData, StoredUserData } from '../../types';
import { getStoredUser } from '../../utils/auth';
import CustomBtn from '../CustomBtn/CustomBtn';

const requestImg = require('../../assets/help_wanted.jpeg');

interface Props {
  request: FullRequestData;
}

export default function RequestDescBox({ request }: Props) {
  const submit = useSubmit();
  const { user, neighborhood } = request;
  const requestDate = request.time_created.split('T')[0];
  let userName = '';

  if (user.first_name && user.last_name) userName = `${user.first_name} ${user.last_name}`;
  else userName = user.username;

  // const [responseInput, setResponseInput] = useState('');

  const loggedUser = getStoredUser() as StoredUserData;
  const { username, id: loggedUserId } = loggedUser;

  function handleCloseRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    submit(event.currentTarget, {
      method: 'post',
      action: `/requests/${request.id}`,
    });
  }

  function handleDeleteRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    submit(event.currentTarget, {
      method: 'post',
      action: `/requests/${request.id}`,
    });
  }

  const hasUserResponded = request.responses.some(
    (response) => response.user_id === Number(loggedUserId),
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
            <Form method="post" onSubmit={handleCloseRequest}>
              <Form.Group>
                <Form.Control type="hidden" name="intent" value="close-request" />
              </Form.Group>
              <CustomBtn className={styles.actionBtn} variant="primary" type="submit">
                Close request
              </CustomBtn>
            </Form>
          </Col>
          <Col xl="2" md="3" sm="3" xs="7" className="p-0 ps-sm-2 me-md-5">
            <Form method="post" onSubmit={handleDeleteRequest}>
              <Form.Group>
                <Form.Control type="hidden" name="intent" value="delete-request" />
                <Form.Control type="hidden" name="neighborhoodId" value={neighborhood.id} />
              </Form.Group>
              <CustomBtn className={styles.actionBtn} variant="danger" type="submit">
                Delete request
              </CustomBtn>
            </Form>
          </Col>
        </>
      );
    } else if (username === request.user.username) {
      return (
        <Col xl="2" md="3" sm="3" xs="7" className="p-0 ps-sm-2 me-md-5">
          <Form method="post" onSubmit={handleDeleteRequest}>
            <Form.Group>
              <Form.Control type="hidden" name="intent" value="delete-request" />
              <Form.Control type="hidden" name="neighborhoodId" value={neighborhood.id} />
            </Form.Group>
            <CustomBtn className={styles.actionBtn} variant="danger" type="submit">
              Delete request
            </CustomBtn>
          </Form>
        </Col>
      );
    } else if (request.status === 'OPEN' && !hasUserResponded) {
      return (
        <Col lg="2" sm="3" xs="7" className="p-0 ps-sm-2 me-md-5">
          <CustomBtn
            className={styles.actionBtn}
            variant="primary"
            onClick={() => console.log('Helping!')}>
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
          <p className={`${styles.requestDate} small`}>Created at {requestDate}</p>
        </Col>
        <Col className="me-sm-2">
          <h3>{request.title}</h3>
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
        {/* {loading ? <Spinner animation="border" /> : null} */}
      </Row>
    </Container>
  );
}
