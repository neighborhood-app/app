import styles from "./Request.module.css";
import { RequestType } from "../../types";
import { ReactElement, useState } from "react";
import RequestModal from "../RequestModal/RequestModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faQuestion } from "@fortawesome/free-solid-svg-icons";

export default function Request({ requestObj }: { requestObj: RequestType }) {
  const date = requestObj.time_created.split("T")[0];
  const [show, setShow] = useState(false);

  const handleCloseModal = () => setShow(false);
  const handleShow = () => setShow(true);

  let statusHeader: ReactElement | null;
   if (requestObj.status === 'OPEN') {
    statusHeader = (
      <div className={styles.statusHeader}>
        <p className={styles.statusP}>{requestObj.status}</p>
        <FontAwesomeIcon icon={faQuestion} size="xl" style={{color: "#3465a4" }} />    
      </div>
    )
  } else if (requestObj.status === 'CLOSED') {
    statusHeader = (
      <div className={styles.statusHeader}>
        <p className={styles.statusP}>{requestObj.status}</p>
        <FontAwesomeIcon icon={faCheck} size="xl" style={{ color: "#3465a4" }} /> 
      </div>
    )
  } else {
    statusHeader = null;
  }

  return (
    <div className={styles.container} onClick={handleShow}>
      <div className={styles.requestHeader}>
        <p>{requestObj.user.username}</p>
        {statusHeader}
      </div>
      <div className={styles.imageContainer}>
        <img className={styles.image} src={require('./help_wanted.jpeg')} alt='Help Wanted' />
      </div>
      <div className={styles.requestContent}>
        <p className={styles.title}>{requestObj.title}</p>
        <p className={styles.date}>Created on {date}</p>
      </div>
      <RequestModal show={show} handleCloseModal={handleCloseModal} request={requestObj} />
    </div>
  );
}
