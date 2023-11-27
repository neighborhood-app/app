// import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NeighborhoodCard.module.css';

type Props = {
  id: string;
  name: string;
  description: string | null;
  isUserAdmin: boolean;
};

export default function NeighborhoodCard({ id, name, description, isUserAdmin }: Props) {
  return (
    <Link to={`neighborhoods/${id}`}>
      <div className={styles.card}>
        <div className={styles.figcaption}>
          <div className={styles.cardText}>
            <h2>
              {name} <span>{isUserAdmin ? 'Admin' : null}</span>
            </h2>
            {description ? <p>{description}</p> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
