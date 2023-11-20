import { useParams } from 'react-router';
import { useSubmit } from 'react-router-dom';
import { useState, FormEvent } from 'react';
import { ResponseWithUser } from '@neighborhood/backend/src/types';
import { Card, Col, Container, Form, Image, Row } from 'react-bootstrap';
import styles from './ResponseBox.module.css';
import { getStoredUser } from '../../utils/auth';
import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';
import CustomBtn from '../CustomBtn/CustomBtn';

const profilePic = require('./images/profile.jpg');

type Props = {
  response: ResponseWithUser;
  requestOwnerId: number;
};

function isLoggedUserRequestOwner(userId: number, requestOwnerId: number) {
  return userId === requestOwnerId;
}

function isLoggedUserResponseOwner(userId: number, responseOwnerId: number) {
  return userId === responseOwnerId;
}

export default function ResponseBox({ response, requestOwnerId }: Props) {
  const { id: requestId } = useParams();

  const [showEditForm, setShowEditForm] = useState(false);
  const [content, setContent] = useState(response.content);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const submit = useSubmit();

  const loggedUser = getStoredUser();
  const loggedUserId = loggedUser ? Number(loggedUser.id) : null;

  const validTextAreaPattern = /\s*(\S\s*){4,}/;
  const validateTextArea = () => validTextAreaPattern.test(content);

  const date = String(response.time_created).split('T')[0];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormSubmitted(true);

    if (!validateTextArea()) {
      event.stopPropagation();
    } else {
      submit(form, {
        method: 'post',
        action: `/requests/${requestId}`,
      });
      setShowEditForm(false);
      setFormSubmitted(false);
    }
  };

  function displayContactInfo() {
    if (!loggedUserId) return null;

    const requestOwner = isLoggedUserRequestOwner(loggedUserId, requestOwnerId);
    const responseOwner = isLoggedUserResponseOwner(loggedUserId, response.user_id);

    if (requestOwner) {
      if (response.status === 'ACCEPTED') {
        return (
          <>
            <hr className={styles.hr} />
            <p className={styles.p}>You've accepted this offer for help.</p>
            <p className={styles.p}>
              Contact at: <span>{response.user.email}</span>
            </p>
          </>
        );
      }

      return (
        <>
          <hr className={styles.hr} />
          <TriggerActionButton
            id={response.id}
            idInputName={'responseId'}
            route={`/requests/${requestId}`}
            intent="accept-offer"
            text="Accept offer"
            className={styles.acceptOfferBtn}
            size="sm"
          />
        </>
      );
    }
    if (responseOwner) {
      if (response.status === 'ACCEPTED') {
        return (
          <>
            <hr className={styles.hr} />
            <p className={styles.p}>Your help offer has been accepted.</p>
            <div className={styles.btnContainer}>
              <TriggerActionButton
                id={response.id}
                idInputName="responseId"
                route={`/requests/${requestId}`}
                intent="delete-response"
                text="Delete"
              />
            </div>
          </>
        );
      }

      return (
        <Row sm="2">
          <Col>
            <TriggerActionButton
              id={response.id}
              idInputName="responseId"
              route={`/requests/${requestId}`}
              intent="delete-response"
              text="Delete response"
            />
          </Col>
          <Col>
            <CustomBtn variant="primary" className="px-4" onClick={() => setShowEditForm(true)}>
              Edit
            </CustomBtn>
          </Col>
        </Row>
      );
    }

    return null;
  }
  const contactInfo = displayContactInfo();
  const editForm = (
    <Form noValidate onSubmit={handleSubmit} role="form">
      <Form.Group className="mb-2" controlId="content">
        <Form.Label column="sm">Write the details of your help offer:</Form.Label>
        <Form.Control
          as="textarea"
          name="content"
          className="mb-3"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          minLength={4}
          required
          isInvalid={!validTextAreaPattern.test(content) && formSubmitted}
          isValid={validTextAreaPattern.test(content)}
        />
        <Form.Control.Feedback type="invalid">
          The content needs to be at least 4 characters long.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Control type="hidden" name="intent" value="edit-response" />
        <Form.Control type="hidden" name="id" value={response.id} />
      </Form.Group>
      <Container fluid className={styles.contact}>
        <Row sm="2">
          <Col>
            <CustomBtn variant="primary" type="submit">
              Submit
            </CustomBtn>
          </Col>
          <Col>
            <CustomBtn
              variant="outline-dark"
              onClick={() => {
                setShowEditForm(false);
                setContent(response.content);
              }}>
              Cancel
            </CustomBtn>
          </Col>
        </Row>
      </Container>
    </Form>
  );

  return (
    <Card>
      <Card.Header className={styles.cardHeader}>
        <Row>
          <Col className="pe-0" xs="auto">
            <Image
              roundedCircle
              className={styles.profileImg}
              src={profilePic}
              alt="active user on neighborhood app"></Image>
          </Col>
          <Col className="pe-0 text-muted small" xs="auto">
            {response.user.username}
          </Col>
          <Col className="text-end pe-1 pe-sm-2 text-muted small">{date}</Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Card.Text className="small mb-0">{showEditForm ? editForm : response.content}</Card.Text>
      </Card.Body>
      <Card.Footer className={`${styles.cardFooter} text-center`}>{contactInfo}</Card.Footer>
    </Card>
  );
}
