import styles from './SingleNeighborhoodPage.module.css';
import DescriptionBox from '../../components/DescriptionBox/DescriptionBox';
import RequestBox from '../../components/RequestBox/RequestBox';
import { NeighborhoodDetailsForMembers } from '../../types';

const NeighborhoodPageForAdmin = (props: { neighborhood: NeighborhoodDetailsForMembers }) => {  
  const { neighborhood } = props;

  return (
    <div className={styles.wrapper}>
      <DescriptionBox
        showJoinBtn={false}
        showEditBtn={true}
        showLeaveBtn={false}
        showMembers={true}
        name={neighborhood.name}
        description={neighborhood.description ? neighborhood.description : ''}
        users={neighborhood.users}
      />
      <RequestBox requests={neighborhood.requests} />
    </div>
  );
};

export default NeighborhoodPageForAdmin;
