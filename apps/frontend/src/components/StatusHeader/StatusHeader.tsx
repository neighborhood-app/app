import styles from "./StatusHeader.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface props {
  status: string;
}

export default function StatusHeader({ status }: props) {
  if (status === "OPEN") {
    return null;
  } else {
    return (
      <div className={styles.statusHeader}>
        <p className={styles.statusP}>{status}</p>
        <FontAwesomeIcon
          icon={faCheck}
          size="xl"
          style={{ color: "#3465a4" }}
        />
      </div>
    );
  }
}
