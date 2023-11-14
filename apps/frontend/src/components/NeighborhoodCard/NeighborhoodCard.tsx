import { Figure } from 'react-bootstrap';
import styles from './NeighborhoodCard.module.css';

const neighborhoodImg = require('./images/palm.jpeg');

type Props = {
  name: string;
  description: string | null;
};

export default function NeighborhoodsBox({ name, description }: Props) {
  return (
    <Figure className={styles.card}>
      <Figure.Image src={neighborhoodImg} alt="neighborhood" className={styles.image} />
      <Figure.Caption className={styles.figcaption}>
        <span className={styles.info}>
          <h2>
            {name} <span>(Admin)</span>
          </h2>
          <p>{description}</p>
        </span>
      </Figure.Caption>
    </Figure>
  );
}
