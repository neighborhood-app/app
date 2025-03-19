import { useParams } from 'react-router';
import { useSubmit } from 'react-router-dom';
import { useState, FormEvent } from 'react';
import { ResponseWithUser } from '@neighborhood/backend/src/types';
import { Card, Col, Image, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from './ResponseBox.module.css';
import { getStoredUser } from '../../utils/auth';
import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';
import CustomBtn from '../CustomBtn/CustomBtn';
import EditResponseForm from '../EditResponseForm/EditResponseForm';
import CloudImg from '../CloudImg/CouldImg';

const profileImgPlaceholder = require('../../assets/icons/user_icon.png');

type Props = {
  response: ResponseWithUser;
  requestOwnerId: number;
};

const isLoggedUserRequestOwner = (userId: number, requestOwnerId: number) =>
  userId === requestOwnerId;

const isLoggedUserResponseOwner = (userId: number, responseOwnerId: number) =>
  userId === responseOwnerId;

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
                variant="danger"
                text={<FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>}
              />
            </div>
          </>
        );
      }

      return (
        <>
          <hr className={styles.hr} />
          <Row className="gy-2 justify-content-center">
            <Col xs="auto">
              <TriggerActionButton
                id={response.id}
                idInputName="responseId"
                route={`/requests/${requestId}`}
                intent="delete-response"
                text={<FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>}
                variant="danger"
              />
            </Col>
            <Col xs="auto">
              <CustomBtn variant="primary" onClick={() => setShowEditForm(true)}>
                <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
              </CustomBtn>
            </Col>
          </Row>
        </>
      );
    }

    return null;
  }
  const contactInfo = displayContactInfo();

  const userImg = response.user.image_url ? (
    <CloudImg
      src={response.user.image_url}
      className={`${styles.profileImg} ${styles.cloudImg}`}></CloudImg>
  ) : (
    <Image roundedCircle src={profileImgPlaceholder} className={styles.profileImg}></Image>
  );

  return (
    <Card>
      <Card.Header className={styles.cardHeader}>
        <Row>
          <Col
            onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
            className="pe-0"
            xs="auto">
            {userImg}
          </Col>
          <Col className="pe-0 text-muted small" xs="auto">
            {response.user.username}
          </Col>
          <Col className="text-end pe-1 pe-sm-2 text-muted small">{date}</Col>
        </Row>
      </Card.Header>
      {showEditForm ? (
        <Card.Body>
          <EditResponseForm
            response={response}
            handleSubmit={handleSubmit}
            setShowEditForm={setShowEditForm}
            setContent={setContent}
            content={content}
            formSubmitted={formSubmitted}></EditResponseForm>
        </Card.Body>
      ) : (
        <>
          <Card.Body>
            <Card.Text className="small mb-0">{response.content}</Card.Text>
          </Card.Body>
          <Card.Footer className={`${styles.cardFooter} text-center`}>{contactInfo}</Card.Footer>
        </>
      )}
    </Card>
  );
}
