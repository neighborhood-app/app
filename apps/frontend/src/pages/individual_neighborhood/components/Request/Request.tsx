import { Button } from "react-bootstrap";
import styles from './Request.module.css';
import { RequestType } from "../../../../types";
import { useState } from "react";

export default function Request({ requestObj }: {requestObj: RequestType}) {
  const date = requestObj.time_created.split('T')[0];
  const [showDetails, setShowDetails] = useState(false);

  function clickHandler() {
    setShowDetails(!showDetails);
  }

  const details = (
    <p>{requestObj.content}</p>
  )

  return (
    <div className={styles.container}>
      <div className={styles.requestHeader}>
        <p>{requestObj.user.user_name}</p>
        <p>{date}</p>
      </div>
      <p>{requestObj.title}</p>
      {showDetails ? details : null}
      <div className={styles.buttonsContainer}>
        {showDetails ? <Button className={styles.button} onClick={clickHandler}>Hide Details</Button> : <Button className={styles.button} onClick={clickHandler}>Show Details</Button>}
        <Button className={styles.button}>Offer Help</Button>
      </div>
    </div>
  )
}

