import { NeighborhoodType } from '../../types';
import styles from './DescriptionBox.module.css';
import { Button } from "react-bootstrap"

export default function DescriptionBox({details} : {details: NeighborhoodType}) {
  return (
    <div className={styles.column}>
      <h1>{details.name}</h1>
      <p>{details.description}</p>
      <Button className={styles.button}>Join Neighborhood</Button>
    </div>
  )
};

