import { UserWithRelatedData } from '@neighborhood/backend/src/types';
import { Col, Row, Form } from 'react-bootstrap';
import { useState } from 'react';
import styles from './EditProfile.module.css';

type Props = {
  profile: UserWithRelatedData;
};

export default function EditProfile({ profile }: Props) {
  // const displayInfo = {
  //   name:
  //     profile.first_name || profile.last_name
  //       ? `${profile.first_name} ${profile.last_name}`
  //       : undefined,
  //   dob: profile.dob ? String(profile.dob) : '-',
  //   bio: profile.bio || '-',
  //   email: profile.email,
  // };

  const [formInput, setFormInput] = useState({
    firstName: profile.first_name || undefined,
    lastName: profile.last_name || undefined,
    bio: profile.bio || undefined,
    dob: profile.dob || undefined,
    email: profile.email || undefined,
  });

  console.log(formInput, setFormInput);

  return (
    <>
      <Form className={styles.form}>
        <Row className={styles.row}>
          <Col sm={12} md={6}>
            <h3>First name</h3>
            <Form.Control value={formInput.firstName} type="text" name="first-name"></Form.Control>
          </Col>
          <Col sm={12} md={6}>
            <h3>Last name</h3>
            <Form.Control value={formInput.lastName} type="text" name="last-name"></Form.Control>
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col sm={12} md={12}>
            <h3>Bio</h3>
            <Form.Control value={formInput.bio} as="textarea" rows={6} name="bio"></Form.Control>
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col sm={12} md={6}>
            <h3>Date of birth</h3>
            <Form.Control className={styles.inputField} type="date" name="dob"></Form.Control>
          </Col>
          <Col sm={12} md={6}>
            <h3>Email</h3>
            <Form.Control value={formInput.email} type="text" name="email"></Form.Control>
          </Col>
        </Row>
      </Form>
    </>
  );
}
