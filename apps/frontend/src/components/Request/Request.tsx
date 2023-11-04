import { useState } from 'react';
import styles from './Request.module.css';
import { RequestWithUserAndResponses } from '../../types';
import RequestModal from '../RequestModal/RequestModal';
import StatusHeader from "../StatusHeader/StatusHeader";

const helpImg = require('./help_wanted.jpeg');

export default function Request({ requestObj }: { requestObj: RequestWithUserAndResponses }) {
  const date = requestObj.time_created.split('T')[0];
  const [show, setShow] = useState(false);

  const handleCloseModal = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className={styles.container} onClick={handleShow}>
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
      <RequestModal show={show} handleCloseModal={handleCloseModal} request={requestObj} />
    </div>
  );
}
