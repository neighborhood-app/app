import SearchFilterForm from "../SearchFilterForm/SearchFilterForm";
import styles from './RequestBox.module.css';
import { Button } from "react-bootstrap";

//@ts-ignore
export default function RequestBox({ requests}) {
  console.log(requests);
  //@ts-ignore
  const requestBoxes = requests.map(request => {
    return (
      <div className={styles.requestBox}>
        <div className={styles.requestHeader}>
          <p className={styles.author}>{request.user.user_name}</p>
          <p>{request.time_created}</p>
        </div>
        <p>{request.content}</p>
        <Button className={styles.helpButton}>Offer help</Button>
      </div>
    )
  })

  return (
    <div className={`${styles.column} ${styles.requestColumn}`}>
      <SearchFilterForm />
      {requestBoxes}
    </div>
  )
}

