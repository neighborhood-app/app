import LinkBtn from '../LinkButton/LinkBtn';
import SubmitBtn from '../SubmitButton/SubmitBtn';
import styles from './DescriptionBox.module.css';
import { User } from '@prisma/client';

interface Props {
  showJoinBtn: boolean,
  showEditBtn: boolean,
  showLeaveBtn: boolean,
  name: string,
  description: string,
  users?: Array<User> | null
}

export default function DescriptionBox({showJoinBtn, showEditBtn, showLeaveBtn, name, description, users}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img className={styles.neighborhoodImg} src={require('./palm.jpeg')} alt='Neighborhood'/>
        <h1 className={styles.neighborhoodTitle}>{name}</h1>
        {showJoinBtn ? <SubmitBtn className={styles.button}>Join Neighborhood</SubmitBtn> : null}
      </div>
      <div className={styles.neighborhoodDescription}>
        <p>{description}</p>
        {users ? <p>{users.length} members</p> : null}
        {/* {showEditBtn ? <button className={styles.editBtn}>Edit Neighborhood</button> : null} */}
        {showEditBtn ? <LinkBtn className={styles.editBtn}>Edit Neighborhood</LinkBtn> : null}

        {showLeaveBtn ? <button className={styles.leaveBtn}>Leave Neighborhood</button> : null}
      </div>
    </div>
  )
};

