import styles from './DescriptionBox.module.css';
import { Button } from "react-bootstrap"

interface Props {
  showJoinBtn: boolean,
  name: string,
  description: string
}

export default function DescriptionBox({showJoinBtn, name, description}: Props) {
  return (
    <>
    <div className={styles.card}>
      <img className={styles.neighborhoodImg} src={require('./palm.jpeg')} alt='Neighborhood'/>
      <h1 className={styles.neighborhoodTitle}>{name}</h1>
      {showJoinBtn ? <button className={styles.button}>Join Neighborhood</button> : null}
    </div>
    <div className={styles.neighborhoodDescription}>
      <p>{description}</p>
    </div>
    </>
  )
};

