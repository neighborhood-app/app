import { useState } from 'react';
import { Figure } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './NeighborhoodCard.module.css';

const neighborhoodImg = require('./images/palm.jpeg');

type Props = {
  id: string,
  name: string;
  description: string | null;
  isUserAdmin: boolean;
};

export default function NeighborhoodCard({ id, name, description, isUserAdmin }: Props) {
  const mql = window.matchMedia('(max-width: 576px)');

  const [smallDisplay, setSmallDisplay] = useState(mql.matches);

  mql.addEventListener('change', () => {
    setSmallDisplay(mql.matches);
  });
  return (
    <Link to={`neighborhoods/${id}`}>
      {smallDisplay ? 
        (<div className={styles.container}>
          <span className={styles.info}>
            <h2>
              {name} <span>{isUserAdmin ? 'Admin' : null}</span>
            </h2>
            {description ? <p>{description}</p> : null}
          </span>
        </div>) :
        (
          <Figure className={styles.card}>
            <Figure.Image src={neighborhoodImg} alt="neighborhood" className={styles.image} />
            <Figure.Caption className={styles.figcaption}>
              <span className={styles.info}>
                <h2>
                  {name} <span>{isUserAdmin ? 'Admin' : null}</span>
                </h2>
                {description ? <p>{description}</p> : null}
              </span>
            </Figure.Caption>
          </Figure>
        )
        }
      
    </Link>
  );
}
