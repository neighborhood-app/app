import { useLoaderData, LoaderFunctionArgs } from 'react-router';
import Switch from '@mui/material/Switch';
import { NeighborhoodsPerPage } from '@neighborhood/backend/src/types';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import styles from './ExplorePage.module.css';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';
import MapLarge from '../../components/MapLarge/MapLarge';

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await neighborhoodsService.getNeighborhoods(Number(params.cursor) || undefined);
  return data;
}

export default function ExplorePage() {
  const { neighborhoods, newCursor, hasNextPage } = useLoaderData() as NeighborhoodsPerPage;

  console.log(neighborhoods);
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
        <FontAwesomeIcon icon={faList} size="lg" style={{ color: '#fe496f' }} />
        <Switch
          className={styles.switch}
          size="medium"
          checked={checked}
          onChange={handleChange}
          sx={{
            '& .MuiSwitch-track': {
              backgroundColor: '#fe496f',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#fe496f',
            },
            '& .MuiSwitch-thumb': {
              backgroundColor: '#fe496f',
            },
          }}
        />
        <FontAwesomeIcon icon={faMap} size="lg" style={{ color: '#fe496f' }} />
      </div>
      {checked ? (
        <MapLarge />
      ) : (
        <NeighborhoodSearch
          neighborhoods={neighborhoods}
          cursor={newCursor}
          isNextPage={hasNextPage}></NeighborhoodSearch>
      )}
    </div>
  );
}
