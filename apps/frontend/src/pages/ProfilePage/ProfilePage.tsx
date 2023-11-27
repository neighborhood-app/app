import { LoaderFunctionArgs, useLoaderData } from 'react-router';
import { UserWithoutPasswordHash } from '@neighborhood/backend/src/types';
import { Container, Row, Col } from 'react-bootstrap';
import CustomBtn from '../../components/CustomBtn/CustomBtn';
import styles from './ProfilePage.module.css';
import { getStoredUser } from '../../utils/auth';
import usersServices from '../../services/users';

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = params.id as string;
  const userData = usersServices.getSingleUser(userId);
  return userData;
}

const profileImage = require('./profile-picture.png');

export default function ProfilePage() {
  const loggedUser = getStoredUser();
  const profileData = useLoaderData() as UserWithoutPasswordHash;

  let isUserAdmin: boolean | null;
  if (loggedUser) {
    isUserAdmin = loggedUser.id === profileData.id;
  } else {
    isUserAdmin = null;
  }

  console.log(isUserAdmin);

  return (
    <Container className={styles.container}>
      <Row className={styles.header}>
        <Col className={styles.column}>
          <img src={profileImage} alt="Profile" className={styles.profilePicture} />
        </Col>
        <Col className={styles.column}>
          <h3 className={styles.userName}>{profileData.username}</h3>
          <CustomBtn variant="primary">Edit Profile</CustomBtn>
        </Col>
      </Row>
    </Container>
  );
}
