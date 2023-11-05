import { User } from '@prisma/client';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import CustomBtn from '../CustomBtn/CustomBtn';
import styles from './DescriptionBox.module.css';
import JoinNeighborhoodForm from '../JoinNeighborhoodForm/JoinNeighborhoodForm';
import UserCircleStack from '../UserCircleStack/UserCircleStack';
import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';

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

  const { id: neighborhoodId } = useParams();
  console.log(showAlert);
  return (
    <Container>
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
      <Row xs="1" sm="2">
        <Col className={styles.column}>
          <img className={styles.neighborhoodImg} src={neighborhoodImg} alt="Neighborhood" />
          <h1 className={styles.neighborhoodTitle}>{name}</h1>
          {showJoinBtn ? <JoinNeighborhoodForm></JoinNeighborhoodForm> : null}
        </Col>
        <Col>
          <div className={styles.membersContainer}>
            {showMembers ? <UserCircleStack usernames={usernames} /> : null}
            {showLeaveBtn ? (
              <FontAwesomeIcon
                icon={faDoorOpen}
                size="2xl"
                className={styles.leaveIcon}
                onClick={() => setShowAlert(true)}
              />
            ) : null}
          </div>
        </Col>
      </Row>
      <Row>
        <div className={styles.neighborhoodDescription}>
          <p>{description}</p>
          {showEditBtn ? (
            <CustomBtn variant="outline-dark" className={styles.editBtn}>
              Edit Neighborhood
            </CustomBtn>
          ) : null}
        </div>
      </Row>
    </Container>
  );
}
