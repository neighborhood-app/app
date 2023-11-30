import { UserWithRelatedData } from '@neighborhood/backend/src/types';
import { Col, Row, Form } from 'react-bootstrap';
import styles from './EditProfile.module.css';

type Props = {
  profile: UserWithRelatedData;
};

export default function EditProfile({ profile }: Props) {
  const displayInfo = {
    name:
      profile.first_name || profile.last_name ? `${profile.first_name} ${profile.last_name}` : null,
    dob: profile.dob ? String(profile.dob) : '-',
    bio: profile.bio || '-',
    email: profile.email,
  };

  return (
    <>
      <Form>
        <Row>
          <Col sm={12} md={6}>
            <h3>Bio</h3>
            <Form.Control value={displayInfo.bio} as="textarea" rows={6} name="bio"></Form.Control>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <h3>Date of birth:</h3>
            <Form.Control
              className={styles.dobField}
              type="date"
              name="dob"
              value={displayInfo.dob}
              placeholder={displayInfo.dob}></Form.Control>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <h3>Email:</h3>
            <Form.Control
              className={styles.emailField}
              value={displayInfo.email}
              type="text"
              name="email"></Form.Control>
          </Col>
        </Row>
      </Form>
    </>
  );
}
