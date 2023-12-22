import { UserWithRelatedData } from '@neighborhood/backend/src/types';
import { Col, Row } from 'react-bootstrap';
import extractDate from '../../utils/utilityFunctions';
import styles from './ProfileInfo.module.css';

type Props = {
  profile: UserWithRelatedData;
};

export default function ProfileInfo({ profile }: Props) {
  const displayInfo = {
    name:
      profile.first_name || profile.last_name ? `${profile.first_name} ${profile.last_name}` : null,
    dob: profile.dob ? extractDate(profile.dob) : '-',
    bio: profile.bio || '-',
    email: profile.email,
  };

  return (
    <>
      <Row>
        <Col sm={12} md={6}>
          <h3>Bio</h3>
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
    </>
  );
}
