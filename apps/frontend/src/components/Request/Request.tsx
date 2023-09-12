import styles from "./Request.module.css";
import { RequestType } from "../../types";
import { useState } from "react";
import RequestModal from "../RequestModal/RequestModal";

export default function Request({ requestObj, updateRequestList }: { requestObj: RequestType, updateRequestList: (requests: Array<RequestType>) => void }) {
  const date = requestObj.time_created.split("T")[0];
  const [show, setShow] = useState(false);

  const handleCloseModal = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className={styles.container} onClick={handleShow}>
      <div className={styles.requestHeader}>
        <p>{requestObj.user.user_name}</p>
      </div>
      <div className={styles.requestImage}>
        <img className={styles.image} src={require('./help_wanted.jpeg')} alt='Help Wanted' />
      </div>
      <div className={styles.requestContent}>
        <p className={styles.title}>{requestObj.title}</p>
        <p className={styles.date}>Created on {date}</p>
      </div>
      <RequestModal show={show} handleCloseModal={handleCloseModal} request={requestObj} updateRequestList={updateRequestList}/>
    </div>
  );
}
