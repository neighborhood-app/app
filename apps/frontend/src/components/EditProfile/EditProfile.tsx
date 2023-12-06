import { UserWithRelatedData, UpdateUserInput } from '@neighborhood/backend/src/types';
import { Col, Row, Form } from 'react-bootstrap';
import { useState, FormEvent } from 'react';
import { useSubmit } from 'react-router-dom';
import CustomBtn from '../CustomBtn/CustomBtn';
import extractDate from '../../utils/utilityFunctions';
import styles from './EditProfile.module.css';

type Props = {
  profile: UserWithRelatedData;
  closeForm: () => void;
};

export default function EditProfile({ profile, closeForm }: Props) {
  const [formInput, setFormInput] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    bio: profile.bio || '',
    dob: extractDate(profile.dob) || '',
    email: profile.email || '',
  });

  const submit = useSubmit();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form: UpdateUserInput = { ...formInput };
    if (!form.dob) {
      delete form.dob;
    }

    submit(form, {
      method: 'put',
      action: `/users/${profile.id}`,
    });
    closeForm();
  };

  return (
    <>
      <Form className={styles.form} onSubmit={handleSubmit}>
        <Row className={styles.row}>
          <Col sm={12} md={6}>
            <h3>First name</h3>
            <Form.Control
              value={formInput.first_name}
              onChange={(event) => {
                setFormInput((formerInput) => ({ ...formerInput, first_name: event.target.value }));
              }}
              type="text"
              name="first-name"
              maxLength={25}></Form.Control>
          </Col>
          <Col sm={12} md={6}>
            <h3>Last name</h3>
            <Form.Control
              value={formInput.last_name}
              onChange={(event) => {
                setFormInput((formerInput) => ({ ...formerInput, last_name: event.target.value }));
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
              type="email"
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
