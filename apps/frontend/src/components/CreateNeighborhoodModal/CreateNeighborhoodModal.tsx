import { Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { useSubmit } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import styles from './CreateNeighborhoodModal.module.css';
import CustomBtn from '../CustomBtn/CustomBtn';

interface Props {
  show: boolean;
  handleClose: () => void;
}

export default function CreateNeighborhoodModal({ show, handleClose }: Props) {
  const validInputPattern = /\s*(\S\s*){4,}/;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [textAreaInput, setTextAreaInput] = useState('');
  const submit = useSubmit();
  const closeModal = () => {
    handleClose();
  };

  function validateInput() {
    return validInputPattern.test(titleInput);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormSubmitted(true);

    if (!form.checkValidity() || !validateInput()) {
      event.stopPropagation();
    } else {
      submit(form, {
        method: 'post',
        action: '/',
      });
      closeModal();
      setFormSubmitted(false);
      setTitleInput('');
      setTextAreaInput('');
    }
  };

  return (
    <Modal show={show} onHide={closeModal} animation={true} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create a new neighborhood</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form role="form" noValidate onSubmit={handleSubmit} className={styles.createReqForm}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label column="sm">
              Name<span className={styles.asterisk}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={titleInput}
              minLength={4}
              isInvalid={!validInputPattern.test(titleInput) && formSubmitted}
              isValid={validInputPattern.test(titleInput)}
              onChange={(event) => {
                setTitleInput(event?.target.value);
                setFormSubmitted(false);
              }}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a valid title.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2" controlId="description">
            <Form.Label column="sm">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={textAreaInput}
              onChange={(event) => {
                setTextAreaInput(event?.target.value);
                setFormSubmitted(false);
              }}
            />
            <Form.Control.Feedback type="invalid">
              The content needs to be at least 4 characters long.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Text className="text-muted">
              Fields marked with <span className={styles.asterisk}>*</span> are required.
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Control type="hidden" name="intent" value="create-neighborhood" />
          </Form.Group>
          <Container className={styles.btnContainer} fluid>
            <Row className="gx-3 gy-2">
              <Col sm={6}>
                <CustomBtn variant="primary" type="submit" className={`${styles.btn}`}>
                  Submit
                </CustomBtn>
              </Col>
              <Col sm={6}>
                <CustomBtn variant="outline-dark" onClick={closeModal} className={styles.btn}>
                  Cancel
                </CustomBtn>
              </Col>
            </Row>
          </Container>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
