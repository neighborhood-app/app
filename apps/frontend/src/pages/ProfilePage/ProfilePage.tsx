import { LoaderFunctionArgs, useLoaderData } from 'react-router';
import { UserWithRelatedData } from '@neighborhood/backend/src/types';
import { Container, Row, Col } from 'react-bootstrap';
import CustomBtn from '../../components/CustomBtn/CustomBtn';
import styles from './ProfilePage.module.css';
import { getStoredUser } from '../../utils/auth';
import usersServices from '../../services/users';

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = params.id;
  const userData = usersServices.getUserData(Number(userId));
  return userData;
}

const profileImage = require('./profile-picture.png');

export default function ProfilePage() {
  const loggedUser = getStoredUser();
  const profileData = useLoaderData() as UserWithRelatedData;

  let isUserAdmin: boolean | null;
  if (loggedUser) {
    isUserAdmin = loggedUser.id === profileData.id;
  } else {
    isUserAdmin = null;
  }

  const displayInfo = {
    name:
      profileData.first_name || profileData.last_name
        ? `${profileData.first_name} ${profileData.last_name}`
        : null,
    dob: profileData.dob ? String(profileData.dob) : '-',
    bio: profileData.bio || '-',
    email: profileData.email,
  };

  console.log(isUserAdmin);

  return (
    <Container className={styles.container} fluid>
      <Row className={styles.header}>
        <Col className={styles.column}>
          <img src={profileImage} alt="Profile" className={styles.profilePicture} />
        </Col>
        <Col className={styles.column}>
          <h2 className={styles.userName}>{profileData.username}</h2>
          {displayInfo.name && <p>{displayInfo.name}</p>}
          <CustomBtn className={styles.btn} variant="primary">
            Update Profile
          </CustomBtn>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={6}>
          <h3 className={styles.profileHeader}>Bio</h3>
          <p className={styles.profileText}>{displayInfo.bio}</p>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={6}>
          <h3>Date of birth:</h3>
          <p className={styles.profileText}>{displayInfo.dob}</p>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={6}>
          <h3>Email:</h3>
          <p className={styles.profileText}>{displayInfo.email}</p>
        </Col>
      </Row>
    </Container>
  );
}
