import { Figure } from "react-bootstrap";
import styles from "./NeighborhoodCard.module.css";

const neighborhoodImg = require('./images/palm.jpeg');

export default function NeighborhoodsBox() {
  return (
        <Figure className={styles.card}>
          <Figure.Image src={neighborhoodImg} alt="neighborhood" className={styles.image}
          />
          <Figure.Caption className={styles.figcaption}>
            <span className={styles.info}>
              <h2>
                Palm Springs <span>(Admin)</span>
              </h2>
              <p>You can join other neighborhoods!</p>
            </span>
          </Figure.Caption>
        </Figure>
  );
}
