import { User } from '@prisma/client';
import CustomBtn from '../CustomBtn/CustomBtn';
import styles from './DescriptionBox.module.css';
import JoinNeighborhoodForm from '../JoinNeighborhoodForm/JoinNeighborhoodForm';

const neighborhoodImg = require('./palm.jpeg');

interface Props {
  showJoinBtn: boolean;
  showEditBtn: boolean;
  showLeaveBtn: boolean;
  name: string;
  description: string;
  users?: Array<User> | null;
}

export default function DescriptionBox({
  showJoinBtn,
  showEditBtn,
  showLeaveBtn,
  name,
  description,
  users,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img className={styles.neighborhoodImg} src={neighborhoodImg} alt="Neighborhood" />
        <h1 className={styles.neighborhoodTitle}>{name}</h1>
        {showJoinBtn ? <JoinNeighborhoodForm></JoinNeighborhoodForm> : null}
      </div>
      <div className={styles.neighborhoodDescription}>
        <p>{description}</p>
        {users ? <p>{users.length} members</p> : null}
        {showEditBtn ? (
          <CustomBtn variant="outline-dark" className={styles.editBtn}>
            Edit Neighborhood
          </CustomBtn>
        ) : null}
        {showLeaveBtn ? <CustomBtn variant="danger">Leave Neighborhood</CustomBtn> : null}
      </div>
    </div>
  );
}
