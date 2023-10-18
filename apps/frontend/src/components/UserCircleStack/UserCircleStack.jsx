import styles from "./UserCircleStack.module.css";

function UserCircle({ username, isLast=false }) {
  const firstTwoLetters = username.slice(0, 2).toUpperCase();

  return (
    <div className={isLast ? styles.lastCircle : styles.circle} style={{ style: "--i: 1" }}>
      <strong>{firstTwoLetters}</strong>
    </div>
  );
}

export default function UserCircleStack({ usernames }) {
  const displayUsers = usernames.slice(0, 3);

  return (
    <div className={styles.circleContainer}>
      {displayUsers.map((username, index) => (
        index === displayUsers.length - 1 ? 
        <UserCircle key={username} username={username} isLast={true}/> :
         <UserCircle key={username} username={username}/>
      ))}
    </div>
  );
}


