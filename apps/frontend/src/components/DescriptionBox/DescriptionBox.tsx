import { Container, Row } from 'react-bootstrap';
import { SetStateAction, useState, Dispatch } from 'react';
import { useParams } from 'react-router';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import CustomBtn from '../CustomBtn/CustomBtn';
import styles from './DescriptionBox.module.css';
import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';
import NeighborhoodModalForm from '../NeighborhoodModalForm/NeighborhoodModalForm';
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
  location: SearchResult | null;
  setPromptDetails: Dispatch<SetStateAction<PromptDetails>>;
}

export default function DescriptionBox({
  userRole,
  name,
  description,
  location,
  setPromptDetails,
}: Props) {
  const [showForm, setShowForm] = useState(false);

  const handleCloseForm = () => setShowForm(false);
  const handleShowForm = () => setShowForm(true);

  const { id: neighborhoodId } = useParams();

  function handleDeletePrompt() {
    setPromptDetails({
      show: true,
      text: 'Are you sure you want to do this? This will delete the neighbourhood for you and all members!',
      intent: 'delete-neighborhood',
    });
  }

  return (
    <Container fluid className={styles.container}>
      <NeighborhoodModalForm
        show={showForm}
        handleClose={handleCloseForm}
        intent="edit-neighborhood"
        action={`/neighborhoods/${neighborhoodId}`}
        name={name}
        description={description}
        location={location}
      />
      <Row className="align-items-center gy-3"></Row>
      <Row className="mt-1 md-4">
        <div className={styles.neighborhoodDescription}>
          {description ? <p>{description}</p> : null}
          {userRole === 'NON-MEMBER' ? (
            <TriggerActionButton
              route={`/neighborhoods/${neighborhoodId}`}
              variant="primary"
              intent="join-neighborhood"
              text="Join Neighbourhood"
            />
          ) : null}
          <div className={styles.buttonsContainer}>
            {userRole === 'ADMIN' ? (
              <CustomBtn
                variant="outline-dark"
                className={`${styles.editBtn}`}
                onClick={handleShowForm}>
                <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
              </CustomBtn>
            ) : null}
            {userRole === 'ADMIN' ? (
              <CustomBtn className={styles.deleteBtn} variant="danger" onClick={handleDeletePrompt}>
                <FontAwesomeIcon icon={faTrashCan} />
              </CustomBtn>
            ) : null}
          </div>
        </div>
      </Row>
    </Container>
  );
}
