import { Form, Modal, Spinner, Container, Col, Row } from 'react-bootstrap';
import { useState, FormEvent } from 'react';
import { useRevalidator, useParams } from 'react-router';
import { useSubmit } from 'react-router-dom';
import styles from './RequestModal.module.css';
import { RequestType, ResponseWithUserAndRequest, StoredUserData } from '../../types';
import requestServices from '../../services/requests';
import { getStoredUser } from '../../utils/auth';
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
  const validTextAreaPattern = /\s*(\S\s*){4,}/;
  const [loading, setIsLoading] = useState(false);
  const [responseInput, setResponseInput] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const revalidator = useRevalidator();
  const { id: neighborhoodId } = useParams();
  const submit = useSubmit();

  const user = getStoredUser() as StoredUserData;
  const { username, id: userId } = user;

  const validateTextArea = () => validTextAreaPattern.test(responseInput);

  const handleResponseSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormSubmitted(true);

    if (!validateTextArea()) {
      event.stopPropagation();
    } else {
      submit(form, {
        method: 'post',
        action: `/neighborhoods/${neighborhoodId}`,
      });
      setShowForm(false);
      setFormSubmitted(false);
      setResponseInput('');
    }
  };

  const responseForm = (
    <Form
      className={styles.createResponseForm}
      role="form"
      onSubmit={handleResponseSubmit}
      noValidate>
      <Form.Group className="mb-2" controlId="content">
        <Form.Label column="sm">Write the details of your help offer:</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="content"
          className="mb-3"
          minLength={4}
          required
          isInvalid={
            (!validTextAreaPattern.test(responseInput)) &&
            formSubmitted
          }
          isValid={validTextAreaPattern.test(responseInput)}
          onChange={(event) => {
            setResponseInput(event.target.value);
            setFormSubmitted(false);
          }}
        />
        <Form.Control.Feedback type="invalid">
          The content needs to be at least 4 characters long.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Control type="hidden" name="intent" value="create-response" />
        <Form.Control type="hidden" name="request_id" value={Number(request.id)} />
      </Form.Group>
      <Container className={styles.btnContainer} fluid>
        <Row className={`gx-3 gy-2 ${styles.responseBtnRow}`}>
          <Col sm="6" lg="3">
            <CustomBtn variant="primary" type="submit" className={styles.btn}>
              Submit
            </CustomBtn>
          </Col>
          <Col sm="6" lg="3">
            <CustomBtn
              variant="outline-dark"
              onClick={() => {
                setShowForm(false);
                setFormSubmitted(false);
              }}
              className={styles.btn}>
              Cancel
            </CustomBtn>
          </Col>
        </Row>
      </Container>
    </Form>
  );

  async function handleCloseRequest() {
    try {
      setIsLoading(true);
      await requestServices.closeRequest(String(request.id));
      setIsLoading(false);
      handleCloseModal();
      revalidator.revalidate();
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  }

  async function handleDeleteRequest() {
    await requestServices.deleteRequest(String(request.id));
    handleCloseModal();
    revalidator.revalidate();
  }

  const responses = request.responses.map((responseObj: ResponseWithUserAndRequest) => (
    <ResponseBox response={responseObj} requestOwnerId={request.user_id} key={responseObj.id} />
  ));

  const hasUserResponded = request.responses.some(
    (response) => response.user_id === Number(userId),
  );
  /**
  * Based on the status of a user (creator, or viewer) and the status of the request 
  (OPEN or CLOSED) returns the corresponding JSX for the request modal.
  */
  function displayRequestActions() {
    if (username === request.user.username && request.status === 'OPEN') {
      return (
        <>
          <CustomBtn variant="primary" onClick={handleCloseRequest}>
            Close request
          </CustomBtn>
          <CustomBtn variant="danger" onClick={handleDeleteRequest}>
            Delete request
          </CustomBtn>
        </>
      );
    }
    if (request.status === 'OPEN' && !hasUserResponded) {
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
        onHide={() => {
          handleCloseModal();
          setShowForm(false);
        }}
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
