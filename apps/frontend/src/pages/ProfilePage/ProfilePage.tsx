import { ActionFunctionArgs, LoaderFunctionArgs, useActionData, useLoaderData } from 'react-router';
import { useEffect, useState } from 'react';
import { UserWithRelatedData } from '@neighborhood/backend/src/types';
import { Container, Row, Col, Image } from 'react-bootstrap';
import CustomBtn from '../../components/CustomBtn/CustomBtn';
import styles from './ProfilePage.module.css';
import { getStoredUser } from '../../utils/auth';
import usersServices from '../../services/users';
import EditProfile from '../../components/EditProfile/EditProfile';
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo';
import CloudImg from '../../components/CloudImg/CouldImg';
import { ErrorObj, UpdatableUserFields } from '../../types';
import AlertBox from '../../components/AlertBox/AlertBox';

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = params.id;
  const userData = usersServices.getUserData(Number(userId));
  return userData;
}

export async function action({ request }: ActionFunctionArgs) {
  const res = await request.formData();
  const userData = Object.fromEntries(res) as unknown as UpdatableUserFields;

  return userData;
}

const profileImgPlaceholder = require('../../assets/icons/user_icon.png');

export default function ProfilePage() {
  const loggedUser = getStoredUser();
  let profileData = useLoaderData() as UserWithRelatedData;
  const updatedData = useActionData() as UpdatableUserFields | ErrorObj | undefined;

  const [edit, setEdit] = useState(false);
  const [error, setError] = useState<null | ErrorObj>(null);

  const [isLoading, setIsLoading] = useState(false);
  const loginResponse = useActionData() as Response | ErrorObj;

  useEffect(() => {
    if (loginResponse && 'error' in loginResponse) {
      setError(loginResponse);
      setIsLoading(false);
    }
    setTimeout(() => {
      setError(null);
    }, 6000);
  }, [loginResponse]);

  useEffect(() => {    
    if (updatedData && 'error' in updatedData) setError(updatedData);
    else if (updatedData) profileData = { ...profileData, ...updatedData };
  }, [updatedData])

  function closeForm() {
    setEdit(false);
  }

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

  const showUpdateButton = isUserAdmin && !edit;
  const userImg = profileData.image_url ? (
    <CloudImg src={profileData.image_url} className={styles.profilePicture}></CloudImg>
  ) : (
    <Image src={profileImgPlaceholder} className={styles.profilePicture}></Image>
  );
  
  return (
    <Container className={styles.container} fluid>
      <Row className="m-3">
        {error && <AlertBox variant="danger" text={error.error}></AlertBox>}
      </Row>
      <Row className={styles.header}>
        <Col onContextMenu={(e) => e.preventDefault()} className={styles.column}>{userImg}</Col>
        <Col className={`${styles.column} ${styles.headerColumn}`}>
          <h3 className={styles.userName}>@{profileData.username}</h3>
          {nameOfUser && <p>{nameOfUser}</p>}
          {showUpdateButton ? (
            <CustomBtn className={styles.btn} variant="primary" onClick={() => setEdit(true)}>
              Update Profile
            </CustomBtn>
          ) : null}
        </Col>
      </Row>
      <div>
        {edit ? (
          <EditProfile
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            profile={profileData}
            closeForm={closeForm}
          />
        ) : (
          <ProfileInfo profile={profileData} />
        )}
      </div>
    </Container>
  );
}
