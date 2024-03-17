import { UserWithRelatedData } from '@neighborhood/backend/src/types';
import { Col, Row, Form } from 'react-bootstrap';
import { useState, FormEvent } from 'react';
// import { useSubmit } from 'react-router-dom';
import CustomBtn from '../CustomBtn/CustomBtn';
import extractDate from '../../utils/utilityFunctions';
import styles from './EditProfile.module.css';
import { UpdateUserInput } from '../../types';
import userServices from '../../services/users';

type Props = {
  profile: UserWithRelatedData;
  closeForm: () => void;
};

export default function EditProfile({ profile, closeForm }: Props) {
  const [profPic, setProfPic] = useState<File | undefined>(undefined);
  const [formInput, setFormInput] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    bio: profile.bio || '',
    dob: extractDate(profile.dob) || '',
    email: profile.email || '',
  });

  // const submit = useSubmit();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDeets: UpdateUserInput = { ...formInput };
    if (!formDeets.dob) {
      delete formDeets.dob;
    }

    const formData = new FormData();
    Object.entries(formInput).forEach(([key, value]) => formData.append(key, value));
    if (profPic) formData.append('image_url', profPic);

    // if (profPic) {
    //   const URL = 'https://api.cloudinary.com/v1_1/dwlk6urra/image/upload';
    //   const cloudFormData = new FormData();
    //   cloudFormData.append('file', profPic);
    //   cloudFormData.append('upload_preset', 'prof_pic');
    //   cloudFormData.append('overwrite', 'true');
    //   cloudFormData.append('public_id', `${profile.username}:${profile.id}`);
    //   cloudFormData.append('api_key', process.env.REACT_APP_CLOUDINARY_API_KEY || '');

    //   const response = await fetch(URL, {
    //     method: 'post',
    //     body: cloudFormData,
    //   }).then(res => res.json())
    //     .catch(console.error);

    //   console.log(response);
    //   // secure_url
    // }

    const res = await userServices.updateProfile(formData, profile.id);
    console.log(res);

    // submit(formData, {
    //   method: 'put',
    //   action: `/users/${profile.id}`,
    // });
    closeForm();
  };

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target as HTMLInputElement & {
      files: FileList;
    };

    setProfPic(target.files[0]);
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
        <Row className="mt-4 mt-md-5 justify-content-center">
          <Col md={4} xs={6} className={'d-flex'}>
            <CustomBtn variant="primary" type="submit" className={styles.btn}>
              Submit
            </CustomBtn>
          </Col>
          <Col md={4} xs={6}>
            <CustomBtn variant="outline-dark" onClick={closeForm} className={styles.btn}>
              Cancel
            </CustomBtn>
          </Col>
        </Row>
      </Form>
    </>
  );
}
