import styles from "./UserCircleStack.module.css";

function UserCircle({ username }) {
  const firstTwoLetters = username.slice(0, 2).toUpperCase();

  return (
    <div className={styles.circle} style={{ style: "--i: 1" }}>
      {firstTwoLetters}
    </div>
  );
}

export default function UserCircleStack({ usernames }) {
  const displayUsers = usernames.slice(0, 4);

  return (
    <div className={styles.circleContainer}>
      {displayUsers.map((username) => (
        <UserCircle key={username} username={username} />
      ))}
    </div>
  );
}


