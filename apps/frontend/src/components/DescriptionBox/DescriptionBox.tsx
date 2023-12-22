import { Container, Row } from 'react-bootstrap';
import { SetStateAction, useState, Dispatch } from 'react';
import { useParams } from 'react-router';

import CustomBtn from '../CustomBtn/CustomBtn';
import styles from './DescriptionBox.module.css';
import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';
import EditNeighborhoodModal from '../EditNeighborhoodModal/EditNeighborhoodModal';
import { FormIntent, UserRole } from '../../types';

interface PromptDetails {
  show: boolean;
  text: string;
  intent: FormIntent;
}

interface Props {
  userRole: UserRole;
  name: string;
  description: string;
  setPromptDetails: Dispatch<SetStateAction<PromptDetails>>;
}

export default function DescriptionBox({
  userRole,
  name,
  description,
  setPromptDetails,
}: Props) {
  const [showForm, setShowForm] = useState(false);

  const handleCloseForm = () => setShowForm(false);
  const handleShowForm = () => setShowForm(true);

  const { id: neighborhoodId } = useParams();

  function handleDeletePrompt() {
    setPromptDetails({
      show: true,
      text: 'Are you sure you want to do this? This will delete the neighborhood for you and all members!',
      intent: 'delete-neighborhood',
    });
  }

  return (
    <Container fluid className={styles.container}>
      <EditNeighborhoodModal
        show={showForm}
        handleClose={handleCloseForm}
        name={name}
        description={description}
      />
      <Row className="align-items-center gy-3">
        
      </Row>
      <Row className="mt-1 md-4">
        <div className={styles.neighborhoodDescription}>
          {description ? <p>{description}</p> : null}
          {userRole === 'NON-MEMBER' ? (
            <TriggerActionButton
              route={`/neighborhoods/${neighborhoodId}`}
              variant="primary"
              intent="join-neighborhood"
              text="Join Neighborhood"
            />
          ) : null}
          <div className={styles.buttonsContainer}>
            {userRole === 'ADMIN' ? (
              <CustomBtn variant="outline-dark" className={styles.btn} onClick={handleShowForm}>
                Edit Neighborhood
              </CustomBtn>
            ) : null}
            {userRole === 'ADMIN' ? (
              <CustomBtn variant="danger" className={styles.btn} onClick={handleDeletePrompt}>
                Delete Neighborhood
              </CustomBtn>
            ) : null}
          </div>
        </div>
      </Row>
    </Container>
  );
}
