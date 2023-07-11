import { NeighborhoodType } from '../../types';
import styles from './DescriptionBox.module.css';
import { Button } from "react-bootstrap"

interface Props {
  name: string,
  description: string
}

export default function DescriptionBox({name, description}: Props) {
  return (
    <div className={styles.column}>
      <h1>{name}</h1>
      <p>{description}</p>
      <Button className={styles.button}>Join Neighborhood</Button>
    </div>
  )
};

