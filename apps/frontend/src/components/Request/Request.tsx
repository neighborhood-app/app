import { useNavigate } from 'react-router';
import { RequestWithUser } from '@neighborhood/backend/src/types';
import styles from './Request.module.css';
import StatusHeader from '../StatusHeader/StatusHeader';

const helpImg = require('./help_wanted.jpeg');

// can pass plain Request object here, without additional info
export default function Request({ requestObj }: { requestObj: RequestWithUser }) {
  console.log(requestObj);
  const date = requestObj.time_created.split('T')[0];
  const navigate = useNavigate();

  return (
    <div className={styles.container} onClick={() => navigate(`/requests/${requestObj.id}`)}>
      <div className={styles.requestHeader}>
        <p>{requestObj.user.username}</p>
        <StatusHeader status={requestObj.status} />
      </div>
      <div className={styles.requestImage}>
        <img className={styles.image} src={helpImg} alt="Help Wanted" />
      </div>
      <div className={styles.requestContent}>
        <p className={styles.title}>{requestObj.title}</p>
        <p className={styles.date}>Created on {date}</p>
      </div>
    </div>
  );
}
