import SearchFilterForm from "../SearchFilterForm/SearchFilterForm";
import styles from './RequestBox.module.css';
import { Button } from "react-bootstrap";

//@ts-ignore
export default function RequestBox({ requests}) {
  //@ts-ignore
  const requestBoxes = requests.map(request => {
    const date = request.time_created.split('T')[0];

      return (
        <div className={styles.requestBox}>
          <div className={styles.requestHeader}>
            <p className={styles.author}>{request.user.user_name}</p>
            <p>{date}</p>
          </div>
          <p>{request.title}</p>
          <Button className={styles.button}>Show Details</Button>
        </div>
      )
  })

  return (
    <div className={`${styles.column}`}>
      <SearchFilterForm />
      {requestBoxes}
    </div>
  )
}

