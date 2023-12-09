import styles from './SingleNeighborhoodPage.module.css';
import DescriptionBox from '../../components/DescriptionBox/DescriptionBox';
import RequestBox from '../../components/RequestBox/RequestBox';
import { NeighborhoodDetailsForMembers } from '../../types';
import MapBox from '../../components/MapBox/MapBox';

const NeighborhoodPageForAdmin = (props: { neighborhood: NeighborhoodDetailsForMembers }) => {
  const { neighborhood } = props;

  return (
    <div className={styles.wrapper}>
      <DescriptionBox
        showJoinBtn={false}
        showEditBtn={true}
        showDeleteBtn={true}
        showLeaveBtn={false}
        showMembers={true}
        name={neighborhood.name}
        description={neighborhood.description ? neighborhood.description : ''}
        users={neighborhood.users}
      />
      <MapBox />
      <RequestBox requests={neighborhood.requests} />
    </div>
  );
};

export default NeighborhoodPageForAdmin;
