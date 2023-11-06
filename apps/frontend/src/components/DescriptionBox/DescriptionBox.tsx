import { User } from '@neighborhood/backend/src/types';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useParams } from 'react-router';
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
    <div className={styles.container}>
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
      <div className={styles.firstHalf}>
        <div className={styles.card}>
          <img className={styles.neighborhoodImg} src={neighborhoodImg} alt="Neighborhood" />
          <h1 className={styles.neighborhoodTitle}>{name}</h1>
          {showJoinBtn ? <JoinNeighborhoodForm></JoinNeighborhoodForm> : null}
        </div>
        <div className={styles.neighborhoodDescription}>
          <p>{description}</p>
          {showEditBtn ? (
            <CustomBtn variant="outline-dark" className={styles.editBtn}>
              Edit Neighborhood
            </CustomBtn>
          ) : null}
          {showLeaveBtn ? (
            <CustomBtn variant="danger" onClick={() => setShowAlert(true)}>
              Leave Neighborhood
            </CustomBtn>
          ) : null}
        </div>
      </div>
      <div className={styles.secondHalf}>
        {showMembers ? <UserCircleStack usernames={usernames} /> : null}
      </div>
    </div>
  );
}
