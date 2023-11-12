import DescriptionBox from '../../components/DescriptionBox/DescriptionBox';
import RequestBox from '../../components/RequestBox/RequestBox';
import { NeighborhoodDetailsForMembers } from '../../types';

import styles from './SingleNeighborhoodPage.module.css';

const NeighborhoodPageForMembers = (props: { neighborhood: NeighborhoodDetailsForMembers }) => {
  const { neighborhood } = props;

  return (
    <div className={styles.wrapper}>
      <DescriptionBox
        showJoinBtn={false}
        showEditBtn={false}
        showLeaveBtn={true}
        showMembers={true}
        name={neighborhood.name}
        description={neighborhood.description ? neighborhood.description : ''}
        users={neighborhood.users}
      />
      <RequestBox requests={neighborhood.requests} />
    </div>
  );
};

export default NeighborhoodPageForMembers;
