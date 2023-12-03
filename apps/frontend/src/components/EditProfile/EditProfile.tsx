import { UserWithRelatedData } from '@neighborhood/backend/src/types';
import { Col, Row, Form } from 'react-bootstrap';
import { useState } from 'react';
import CustomBtn from '../CustomBtn/CustomBtn';
import extractDate from '../../utils/utilityFunctions';
import styles from './EditProfile.module.css';

type Props = {
  profile: UserWithRelatedData;
  closeForm: () => void;
};

export default function EditProfile({ profile, closeForm }: Props) {
  const [formInput, setFormInput] = useState({
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    bio: profile.bio || '',
    dob: extractDate(profile.dob) || '',
    email: profile.email || '',
  });

  console.log(formInput, setFormInput);

  return (
    <>
      <Form className={styles.form}>
        <Row className={styles.row}>
          <Col sm={12} md={6}>
            <h3>First name</h3>
            <Form.Control
              value={formInput.firstName}
              onChange={(event) => {
                setFormInput((formerInput) => ({ ...formerInput, firstName: event.target.value }));
              }}
              type="text"
              name="first-name"
              maxLength={25}></Form.Control>
          </Col>
          <Col sm={12} md={6}>
            <h3>Last name</h3>
            <Form.Control
              value={formInput.lastName}
              onChange={(event) => {
                setFormInput((formerInput) => ({ ...formerInput, lastName: event.target.value }));
              }}
              type="text"
              name="last-name"
              maxLength={25}></Form.Control>
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col sm={12} md={12}>
            <h3>Bio</h3>
            <Form.Control
              value={formInput.bio}
              onChange={(event) => {
                setFormInput((formerInput) => ({ ...formerInput, bio: event.target.value }));
              }}
              as="textarea"
              rows={6}
              name="bio"
              maxLength={500}></Form.Control>
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col sm={12} md={6}>
            <h3>Date of birth</h3>
            <Form.Control
              className={styles.inputField}
              value={formInput.dob}
              onChange={(event) => {
                setFormInput((formerInput) => ({ ...formerInput, dob: event.target.value }));
              }}
              type="date"
              name="dob"></Form.Control>
          </Col>
          <Col sm={12} md={6}>
            <h3>Email</h3>
            <Form.Control
              value={formInput.email}
              onChange={(event) => {
                setFormInput((formerInput) => ({ ...formerInput, email: event.target.value }));
              }}
              type="text"
              name="email"
              maxLength={40}></Form.Control>
          </Col>
        </Row>
        <Row>
          <Col sm={6} className={'d-flex justify-content-end'}>
            <CustomBtn variant="primary" type="submit">
              Submit
            </CustomBtn>
          </Col>
          <Col sm={6}>
            <CustomBtn variant="outline-dark" onClick={closeForm} className={styles.btn}>
              Cancel
            </CustomBtn>
          </Col>
        </Row>
      </Form>
    </>
  );
}
