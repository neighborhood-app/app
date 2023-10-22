import { Form, Modal, Spinner, Container, Col, Row } from 'react-bootstrap';
import { useState } from 'react';
import { useRevalidator } from 'react-router';
import styles from './RequestModal.module.css';
import { RequestType, ResponseWithUserAndRequest } from '../../types';
import requestServices from '../../services/requests';
import ResponseBox from '../ResponseBox/ResponseBox';
import StatusHeader from '../StatusHeader/StatusHeader';
import CustomBtn from '../CustomBtn/CustomBtn';

const requestImg = require('./images/image.jpeg');

interface Props {
  show: boolean;
  handleCloseModal: () => void;
  request: RequestType;
}

export default function RequestModal({ show, handleCloseModal, request }: Props) {
  const [loading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const revalidator = useRevalidator();

  const responseForm = (
    <Form className={styles.createResponseForm}>
      <Form.Group className="mb-2" controlId="content">
        <Form.Label column="sm">Write the details of your help offer:</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="content"
          minLength={4}
          // onChange={hideValidation}
          // onBlur={validateTextArea}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please input some explanatory content.
        </Form.Control.Feedback>
      </Form.Group>
      <Container className={styles.btnContainer} fluid>
        <Row className="gx-3 gy-2">
          <Col sm={6}>
            <CustomBtn variant="primary" type="submit" className={`${styles.btn}`}>
              Submit
            </CustomBtn>
          </Col>
          <Col sm={6}>
            <CustomBtn variant="outline-dark" className={styles.btn}>
              Cancel
            </CustomBtn>
          </Col>
        </Row>
      </Container>
    </Form>
  );

  // Delete this
  async function handleCloseRequest() {
    try {
      setIsLoading(true);
      await requestServices.closeRequest(String(request.id));
      await requestServices.closeRequest(String(request.id));
      setIsLoading(false);
      handleCloseModal();
      revalidator.revalidate();
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  }

  const responses = request.responses.map((responseObj: ResponseWithUserAndRequest) => (
    <ResponseBox response={responseObj} requestOwnerId={request.user_id} key={responseObj.id} />
  ));

  /**
  * Based on the status of a user (creator, or viewer) and the status of the request 
  (OPEN or CLOSED) returns the corresponding JSX for the request modal.
  */
  function displayRequestActions() {
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).username : null;
    if (username === request.user.username && request.status === 'OPEN') {
      return (
        <CustomBtn variant="danger" onClick={handleCloseRequest}>
          Close request
        </CustomBtn>
      );
    } else if (request.status === 'OPEN') {
      return (
        <CustomBtn variant="primary" onClick={() => setShowForm(true)}>
          Offer help
        </CustomBtn>
      );
    }

    return null;
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal
        show={show}
        onHide={handleCloseModal}
        animation={true}
        backdrop="static"
        centered
        className={styles.modal}
        dialogClassName="modal-w200"
        size="xl">
        <Modal.Header closeButton>{request.user.username}</Modal.Header>
        <Modal.Body>
          <section className={styles.currentRequestInfo}>
            <img
              src={requestImg}
              alt="active request on neighborhood app"
              className={styles.requestImage}
            />
            <div className={styles.requestContent}>
              <h1 className={styles.h1}>{request.title}</h1>
              <p className={styles.p}>{request.content}</p>
              <div className={styles.buttonGroups}>
                {displayRequestActions()}
                {loading ? <Spinner animation="border" /> : null}
              </div>
            </div>
            <StatusHeader status={request.status} />
          </section>
          <section>{showForm ? responseForm : null}</section>
          <section className={styles.responseSection}>{showForm ? null : responses}</section>
        </Modal.Body>
      </Modal>
    </div>
  );
}
