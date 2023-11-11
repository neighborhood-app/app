import { User } from '@neighborhood/backend/src/types';
import { Container, Row, Col, Modal, Image } from 'react-bootstrap';
import { useState } from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import CustomBtn from '../CustomBtn/CustomBtn';
import styles from './DescriptionBox.module.css';
import UserCircleStack from '../UserCircleStack/UserCircleStack';
import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';
import EditNeighborhoodModal from '../EditNeighborhoodModal/EditNeighborhoodModal';

const neighborhoodImg = require('./palm.jpeg');

interface Props {
  showJoinBtn: boolean;
  showEditBtn: boolean;
  showLeaveBtn: boolean;
  showMembers: boolean;
  name: string;
  description: string;
  users?: Array<User> | null;
}

export default function DescriptionBox({
  showJoinBtn,
  showEditBtn,
  showLeaveBtn,
  showMembers,
  name,
  description,
  users,
}: Props) {
  const usernames = users?.map((user) => user.username);
  const [showAlert, setShowAlert] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { id: neighborhoodId } = useParams();
  return (
    <Container fluid className={styles.container}>
      <Modal show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Body>Are you sure you want to leave this neighborhood?</Modal.Body>
        <Modal.Footer>
          <div className={styles.alertBtnContainer}>
            <TriggerActionButton
              route={`/neighborhoods/${neighborhoodId}`}
              variant="primary"
              intent="leave-neighborhood"
              text="Yes"
            />
            <CustomBtn
              variant="outline-dark"
              className={styles.alertBtn}
              onClick={() => setShowAlert(false)}>
              No
            </CustomBtn>
          </div>
        </Modal.Footer>
      </Modal>
      <EditNeighborhoodModal
        show={show}
        handleClose={handleClose}
        name={name}
        description={description}
      />
      <Row className="align-items-center gy-3">
        <Col xs="auto" className="">
          <Image
            className={styles.neighborhoodImg}
            roundedCircle
            src={neighborhoodImg}
            alt="Neighborhood"></Image>
        </Col>
        <Col xs="12" sm="auto" className="">
          <h1>{name}</h1>
        </Col>
        <Col
          xs="12"
          md="2"
          className={`${styles.membersContainer} justify-content-md-end ms-md-auto ms-3 pe-0`}>
          {showMembers ? <UserCircleStack usernames={usernames} /> : null}
          {showLeaveBtn ? (
            <FontAwesomeIcon
              icon={faDoorOpen}
              size="2xl"
              className={styles.leaveIcon}
              onClick={() => setShowAlert(true)}
            />
          ) : null}
        </Col>
      </Row>
      <Row>
        <div className={styles.neighborhoodDescription}>
          {description ? <p>{description}</p> : null}
          {showJoinBtn ? (
            <TriggerActionButton
              route={`/neighborhoods/${neighborhoodId}`}
              variant="primary"
              intent="join-neighborhood"
              text="Join Neighborhood"
            />
          ) : null}
          {showEditBtn ? (
            <CustomBtn variant="outline-dark" className={styles.editBtn} onClick={handleShow}>
              Edit Neighborhood
            </CustomBtn>
          ) : null}
        </div>
      </Row>
    </Container>
  );
}
