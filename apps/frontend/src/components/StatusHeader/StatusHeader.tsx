import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import styles from './StatusHeader.module.css';

interface Props {
  status: string;
}

export default function StatusHeader({ status }: Props) {
  if (status === 'INACTIVE') {
    return (
      <div className={styles.statusHeader}>
        <p className={styles.pInactive}>{status}</p>
        <FontAwesomeIcon className={styles.iconInactive} icon={faBan} />
      </div>
    );
  } else if (status === 'CLOSED') {
    return (
      <div className={styles.statusHeader}>
        <p className={styles.pClosed}>{status}</p>
        <FontAwesomeIcon className={styles.iconClosed} icon={faCheck} size="xl" />
      </div>
    );
  }

  return null;
}
