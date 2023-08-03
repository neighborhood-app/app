import styles from './DescriptionBox.module.css';
import { Button } from "react-bootstrap"

interface Props {
  showJoinBtn: boolean,
  name: string,
  description: string
}

export default function DescriptionBox({showJoinBtn, name, description}: Props) {
  return (
    <div className={styles.column}>
      <h1>{name}</h1>
      <p>{description}</p>
      {showJoinBtn ? <Button className={styles.button}>Join Neighborhood</Button> : null}
    </div>
  )
};

