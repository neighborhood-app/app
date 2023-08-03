import styles from "./MemberBox.module.css";
import { Button } from "react-bootstrap";
import type { User } from "../../types";

interface Props {
  showLeaveBtn: boolean;
  admin: User;
  users: Array<User>;
}

export default function MemberBox({ showLeaveBtn, admin, users }: Props) {
  const userNames = users
    ? users.map((user) => {
        return (
          <li className={styles.liElement} key={user.id}>
            {user.user_name}
          </li>
        );
      })
    : "There are currently no members of this neighborhood.";

  return (
    <div className={`${styles.column} ${styles.memberColumn}`}>
      <p>
        <strong>
          <u>Admin</u>
        </strong>
      </p>
      <p>{admin.user_name}</p>
      <p>
        <strong>
          <u>Members</u>
        </strong>
      </p>
      <ul className={styles.list}>{userNames}</ul>
      {showLeaveBtn ? (
        <Button className={styles.button}>Leave Neighborhood</Button>
      ) : null}
    </div>
  );
}
