import { useLoaderData, LoaderFunctionArgs } from 'react-router';
import Switch from '@mui/material/Switch';
import { NeighborhoodsPerPage } from '@neighborhood/backend/src/types';
import { useState } from 'react';
import styles from './ExplorePage.module.css';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await neighborhoodsService.getNeighborhoods(Number(params.cursor) || undefined);
  return data;
}

export default function ExplorePage() {
  const { neighborhoods, newCursor, hasNextPage } = useLoaderData() as NeighborhoodsPerPage;

  /*
  If checked, page will display the map view, if unchecked it will display the list view;
  Default is list view.
  */
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.switchContainer}>
        <p>List</p>
        <Switch className={styles.switch} size="medium" checked={checked} onChange={handleChange} />
        <p>Map</p>
      </div>
      {checked ? null : (
        <NeighborhoodSearch
          neighborhoods={neighborhoods}
          cursor={newCursor}
          isNextPage={hasNextPage}></NeighborhoodSearch>
      )}
    </div>
  );
}
