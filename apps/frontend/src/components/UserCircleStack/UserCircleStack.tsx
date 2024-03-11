import { User } from '@prisma/client';
import { Link } from 'react-router-dom';
import UserCircle from '../UserCircle/UserCircle';
import styles from './UserCircleStack.module.css';

export default function UserCircleStack({ users }: { users?: User[] | null }) {
  if (Array.isArray(users)) {
    const displayUsers = users.slice(0, 3);
    const usersLeft = users.length - 3;

    return (
      <div className={styles.circleContainer}>
        {displayUsers.map((user, index) =>
          index === displayUsers.length - 1 ? (
            <Link to={`/users/${user.id}`} className={styles.circleLink}>
              <UserCircle key={user.id} username={user.username} isLast={true} />
            </Link>
          ) : (
            <Link to={`/users/${user.id}`} className={styles.circleLink}>
              <UserCircle key={user.id} username={user.username} />
            </Link>
          ),
        )}
        {/* If there are more than 3 users a circle is shown with how many users there are left. */}
        {usersLeft > 0 ? <UserCircle username={`+1${usersLeft}`} isLast={true} /> : null}
      </div>
    );
  }

  return null;
}
