import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faBan,
  faCheck,
  faPencil,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';
import styles from './RequestDescBox.module.css';
import { FullRequestData, StoredUserData } from '../../types';
import { getStoredUser } from '../../utils/auth';
import CustomBtn from '../CustomBtn/CustomBtn';
import CreateResponseModal from '../CreateResponseModal/CreateResponseModal';
import EditRequestModal from '../EditRequestModal/EditRequestModal';
import CloudImg from '../CloudImg/CouldImg';

const requestImg: string = require('../../assets/help_wanted.jpeg');
const profileImgPlaceholder: string = require('../../assets/icons/user_icon.png');

interface Props {
  request: FullRequestData;
}

export default function RequestDescBox({ request }: Props) {
  const [showCreateRes, setShowCreateRes] = useState(false);
  const handleCloseCreateRes = () => setShowCreateRes(false);
  const handleShowCreateRes = () => setShowCreateRes(true);

  const [showEditReq, setShowEditReq] = useState(false);
  const handleCloseEditReq = () => setShowEditReq(false);
  const handleShowEditReq = () => setShowEditReq(true);

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

  const userImg = user.image_url ? (
    <CloudImg
      src={user.image_url}
      className={`${styles.userIcon} ${styles.cloudImg}`}></CloudImg>
  ) : (
    <Image roundedCircle src={profileImgPlaceholder} className={styles.userIcon}></Image>
  );

  const deleteBtnColumn = (
    <Col className={`${styles.formBtn} pe-md-3`}>
      <TriggerActionButton
        className={`${styles.formBtn} ${styles.iconBtn}`}
        id={neighborhood.id}
        idInputName="neighborhoodId"
        route={`/requests/${request.id}`}
        variant="danger"
        intent="delete-request"
        title="Delete request"
        text={<FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>}
      />
    </Col>
  );

  const offerHelpBtn =
    username !== request.user.username && request.status === 'OPEN' && !hasUserResponded ? (
      <Col lg="2" sm="3" xs="7" className="p-0 ps-sm-2 me-md-5">
        <CustomBtn className={styles.actionBtn} variant="primary" onClick={handleShowCreateRes}>
          Offer help
        </CustomBtn>
      </Col>
    ) : null;

  /**
  * Based on the status of a user (creator, or viewer) and the status of the request 
  (OPEN or CLOSED) returns the corresponding JSX for the request modal.
  */
  const displayRequestActions = () => {
    if (
      username === request.user.username &&
      request.status === 'OPEN' &&
      request.responses.length > 0
    ) {
      return (
        <>
          <Col className={`${styles.formBtn} pe-2`}>
            <TriggerActionButton
              className={styles.iconBtn}
              route={`/requests/${request.id}`}
              variant="primary"
              intent="close-request"
              title="Close request"
              text={<FontAwesomeIcon icon={faCheck} />}
            />
          </Col>
          <Col className={`${styles.formBtn} pe-2`}>
            <CustomBtn
              className={styles.iconBtn}
              variant="outline-dark"
              title="Edit request"
              onClick={handleShowEditReq}>
              <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
            </CustomBtn>
          </Col>
          {deleteBtnColumn}
        </>
      );
    } else if (username === request.user.username) {
      return (
        <>
          <Col className={`${styles.formBtn} pe-2`}>
            <CustomBtn
              className={styles.iconBtn}
              variant="outline-dark"
              title="Edit request"
              onClick={handleShowEditReq}>
              <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
            </CustomBtn>
          </Col>
          {deleteBtnColumn}
        </>
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
          <Row className="mb-2">
            <Col>
              <h3>
                {request.title}
                {requestStatusIcon}
              </h3>
            </Col>
            <Col md="auto" sm="12">
              {displayRequestActions()}
            </Col>
          </Row>
          <Link
            onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
            to={`/users/${user.id}`}
            className={styles.reqUserInfo}>
            {userImg}
            <p className={`${styles.userName} text-muted`}>{userName}</p>
          </Link>
          <p className="pe-sm-3">{request.content}</p>
        </Col>
      </Row>
      <Row className="mb-3 gx-3 justify-content-sm-start justify-content-center">
        <Col sm="3"></Col>
        {offerHelpBtn}
      </Row>
      <EditRequestModal
        show={showEditReq}
        handleClose={handleCloseEditReq}
        title={request.title}
        content={request.content}></EditRequestModal>
      <CreateResponseModal show={showCreateRes} handleClose={handleCloseCreateRes} />
    </Container>
  );
}
