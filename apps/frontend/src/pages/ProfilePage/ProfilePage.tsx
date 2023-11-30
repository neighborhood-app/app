import { LoaderFunctionArgs, useLoaderData } from 'react-router';
import { useState } from 'react';
import { UserWithRelatedData } from '@neighborhood/backend/src/types';
import { Container, Row, Col } from 'react-bootstrap';
import CustomBtn from '../../components/CustomBtn/CustomBtn';
import styles from './ProfilePage.module.css';
import { getStoredUser } from '../../utils/auth';
import usersServices from '../../services/users';
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo';
import EditProfile from '../../components/EditProfile/EditProfile';

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = params.id;
  const userData = usersServices.getUserData(Number(userId));
  return userData;
}

const profileImage = require('./profile-picture.png');

export default function ProfilePage() {
  const loggedUser = getStoredUser();
  const profileData = useLoaderData() as UserWithRelatedData;

  const [edit, setEdit] = useState(false);

  let isUserAdmin: boolean | null;
  if (loggedUser) {
    isUserAdmin = loggedUser.id === profileData.id;
  } else {
    isUserAdmin = null;
  }

  const nameOfUser =
    profileData.first_name || profileData.last_name
      ? `${profileData.first_name} ${profileData.last_name}`
      : null;

  console.log(isUserAdmin);

  return (
    <Container className={styles.container} fluid>
      <Row className={styles.header}>
        <Col className={styles.column}>
          <img src={profileImage} alt="Profile" className={styles.profilePicture} />
        </Col>
        <Col className={styles.column}>
          <h2 className={styles.userName}>{profileData.username}</h2>
          {nameOfUser && <p>{nameOfUser}</p>}
          <CustomBtn className={styles.btn} variant="primary" onClick={() => setEdit(true)}>
            Update Profile
          </CustomBtn>
        </Col>
      </Row>
      <div>
        {edit ? <EditProfile profile={profileData} /> : <ProfileInfo profile={profileData} />}
      </div>
    </Container>
  );
}