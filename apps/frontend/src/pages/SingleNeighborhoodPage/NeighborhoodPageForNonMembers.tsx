import styles from './SingleNeighborhoodPage.module.css';
import DescriptionBox from '../../components/DescriptionBox/DescriptionBox';
import { NeighborhoodDetailsForNonMembers } from '../../types';

const NeighborhoodPageForNonMembers = (props: {
  neighborhood: NeighborhoodDetailsForNonMembers;
}) => {
  const { neighborhood } = props;

  return (
    <div className={styles.wrapper}>
      <DescriptionBox
        showJoinBtn={true}
        showEditBtn={false}
        showLeaveBtn={false}
        showMembers={false}
        name={neighborhood.name}
        description={neighborhood.description ? neighborhood.description : ''}
      />
    </div>
  );
};

export default NeighborhoodPageForNonMembers;
