import { User } from '@prisma/client';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import UserCircle from '../UserCircle/UserCircle';
import styles from './UserCircleStack.module.css';

export default function UserCircleStack({ users }: { users?: User[] | null }) {
  const [showUserList, setShowUserList] = useState(false);

  if (Array.isArray(users)) {
    const displayUsers = users.slice(0, 3);
    const restOfUsers = users.slice(3);
    const usersLeft = users.length - 3;
    console.log(usersLeft);

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
          {usersLeft > 0 ? (
            <div className={styles.dropdownContainer} onMouseEnter={() => setShowUserList(true)} onMouseLeave={() => setShowUserList(false)}>
              <UserCircle
                username={`+${usersLeft}`}
                isLast={true}
              />
              <Dropdown show={showUserList} className={styles.dropdown}>
                <Dropdown.Menu>
                  {restOfUsers.map((user) => (
                    <Dropdown.Item>{user.username}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : null}
        </div>
    );
  }

  return null;
}
