import styles from './UserCircle.module.css';

export default function UserCircle({
  username,
  isLast = false,
  inStack = true,
}: {
  username: string;
  isLast?: boolean;
  inStack?: boolean;
  }) {  
  const firstTwoLetters = username?.slice(0, 2).toUpperCase();

  return (
    <div
      className={`${styles.circle} ${isLast ? styles.lastCircle : ''} ${
        inStack ? styles.inStack : ''
      }`}>
      {firstTwoLetters}
    </div>
  );
}
