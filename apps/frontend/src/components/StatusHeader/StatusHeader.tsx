import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './StatusHeader.module.css';

interface Props {
  status: string;
}

export default function StatusHeader({ status }: Props) {
  if (status === 'OPEN') return null;

  return (
    <div className={styles.statusHeader}>
      <p className={styles.statusP}>{status}</p>
      <FontAwesomeIcon icon={faCheck} size="xl" style={{ color: '#3465a4' }} />
    </div>
  );
}
