import styles from './UserCircleStack.module.css';

function UserCircle({ username, isLast = false }: { username: string; isLast?: boolean }) {
  const firstTwoLetters = username.slice(0, 2).toUpperCase();

  return (
    <div
      className={isLast ? styles.lastCircle : styles.circle}
      style={{ '--i': 1 } as React.CSSProperties}>
      <strong>{firstTwoLetters}</strong>
    </div>
  );
}

export default function UserCircleStack({ usernames }: { usernames?: string[] }) {
  if (Array.isArray(usernames)) {
    const displayUsers = usernames.slice(0, 3);
    const usersLeft = usernames.length - 3;

    return (
      <div className={styles.circleContainer}>
        {displayUsers.map((username, index) =>
          index === displayUsers.length - 1 ? (
            <UserCircle key={username} username={username} isLast={true} />
          ) : (
            <UserCircle key={username} username={username} />
          ),
        )}
        {/* If there are more than 3 users a circle is shown with how many users there are left. */}
        {usersLeft > 0 ? <UserCircle username={`+1${usersLeft}`} isLast={true} /> : null}
      </div>
    );
  }

  return null;
}
