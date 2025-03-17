import { UserWithRelatedData } from '@neighborhood/backend/src/types';
import { Col, Row, Form } from 'react-bootstrap';
import React, { useState, FormEvent } from 'react';
import { useSubmit } from 'react-router-dom';
import CustomBtn from '../CustomBtn/CustomBtn';
import extractDate from '../../utils/utilityFunctions';
import styles from './EditProfile.module.css';
import { ErrorObj, UpdatableUserFields, UpdateUserInput } from '../../types';
import userServices from '../../services/users';
import SpinWheel from '../SpinWheel/SpinWheel';

type Props = {
  profile: UserWithRelatedData;
  closeForm: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditProfile({
  profile,
  closeForm,
  isLoading,
  setIsLoading
 }: Props) {
  const [profPic, setProfPic] = useState<File | undefined>(undefined);
  const [formInput, setFormInput] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    bio: profile.bio || '',
    dob: extractDate(profile.dob) || '',
    email: profile.email || '',
  });

  const submit = useSubmit();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDeets: UpdateUserInput = { ...formInput };
    if (!formDeets.dob) {
      delete formDeets.dob;
    }

    const formData = new FormData();
    Object.entries(formInput).forEach(([key, value]) => formData.append(key, value));
    if (profPic) formData.append('image_url', profPic);

    const res = await userServices.updateProfile(formData, profile.id);
    const responseData: ErrorObj | UpdatableUserFields =
    'error' in res
    ? res
    : {
      first_name: res.first_name || '',
      last_name: res.last_name || '',
      email: res.email || '',
      image_url: res.image_url || '',
      dob: res.dob || null,
      bio: res.bio || '',
    };

    submit(responseData as unknown as { [name: string]: string }, {
      method: 'post',
      action: `/users/${profile.id}`,
    });

    closeForm();
    setIsLoading(false);
  };

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target as HTMLInputElement & {
      files: FileList;
    };

    setProfPic(target.files[0]);
  };

  const changeLoadState = () => setIsLoading(true);

  const cancelEditHandler = () => {
    setIsLoading(false);
    closeForm();
  }

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
        <Row className={styles.row}>
          <Col>
            <h3>Image</h3>
            <Form.Control
              className={styles.inputField}
              onChange={handleImageChange}
              type="file"
              accept="image/*"
              name="image"></Form.Control>
          </Col>
        </Row>
        <Row className="justify-content-center">
          {isLoading && <SpinWheel className={styles.spinner}></SpinWheel>}
        </Row>
        <Row className="mt-4 mt-md-5 justify-content-center">
          <Col md={4} xs={6} className={'d-flex'}>
            <CustomBtn
              variant="primary"
              type="submit"
              className={styles.btn}
              onClick={changeLoadState}>
              Submit
            </CustomBtn>
          </Col>
          <Col md={4} xs={6}>
            <CustomBtn
              variant="outline-dark"
              onClick={cancelEditHandler}
              className={styles.btn}>
              Cancel
            </CustomBtn>
          </Col>
        </Row>
      </Form>
    </>
  );
}
