import type { User } from '@neighborhood/backend/src/types';
import styles from './MemberBox.module.css';
import CustomBtn from '../CustomBtn/CustomBtn';

interface Props {
  showLeaveBtn: boolean;
  admin: User;
  users: Array<User>;
}

export default function MemberBox({ showLeaveBtn, admin, users }: Props) {
  const userNames = users
    ? users.map((user) => (
        <li className={styles.liElement} key={user.id}>
          {user.username}
        </li>
      ))
    : 'There are currently no members of this neighbourhood.';

  return (
    <div className={`${styles.column} ${styles.memberColumn}`}>
      <p>
        <strong>
          <u>Admin</u>
        </strong>
      </p>
      <p>{admin.username}</p>
      <p>
        <strong>
          <u>Members</u>
        </strong>
      </p>
      <ul className={styles.list}>{userNames}</ul>
      {showLeaveBtn ? (
        <CustomBtn variant="danger" className={styles.button}>
          Leave Neighbourhood
        </CustomBtn>
      ) : null}
    </div>
  );
}
