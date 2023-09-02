import styles from "./Request.module.css";
import { RequestType } from "../../types";
import { useState } from "react";

export default function Request({ requestObj }: { requestObj: RequestType }) {
  const date = requestObj.time_created.split("T")[0];
  const [showDetails, setShowDetails] = useState(false);

  function clickHandler() {
    setShowDetails(!showDetails);
  }

  const details = <p>{requestObj.content}</p>;

  return (
    <div className={styles.container}>
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
    </div>
  );
}
