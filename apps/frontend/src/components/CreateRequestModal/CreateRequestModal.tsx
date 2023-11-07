import { Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { useParams, useSubmit } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import styles from './CreateRequestModal.module.css';
import CustomBtn from '../CustomBtn/CustomBtn';

interface Props {
  show: boolean;
  handleClose: () => void;
}

export default function CreateRequestModal({ show, handleClose }: Props) {
  const validInputPattern = /\s*(\S\s*){4,}/;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [textAreaInput, setTextAreaInput] = useState('');
  const { id: neighborhoodId } = useParams();
  const submit = useSubmit();
  const closeModal = () => {
    handleClose();
  };

  function validateInput() {
     return validInputPattern.test(textAreaInput) && validInputPattern.test(titleInput)
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormSubmitted(true);

    if (!form.checkValidity() || !validateInput()) {
      event.stopPropagation();

    } else {
      submit(form, {
        method: 'post',
        action: `/neighborhoods/${neighborhoodId}`,
      });
      closeModal();
      setFormSubmitted(false);
      setTitleInput("");
      setTextAreaInput("");
    }
  };

  return (
    <Modal show={show} onHide={closeModal} animation={true} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create a request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          role="form"
          noValidate
          onSubmit={handleSubmit}
          className={styles.createReqForm}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label column="sm">
              Title<span className={styles.asterisk}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              minLength={4}
              isInvalid={
                (!validInputPattern.test(titleInput)) && formSubmitted
              }
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
          <Form.Group className="mb-2" controlId="content">
            <Form.Label column="sm">
              Content<span className={styles.asterisk}>*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="content"
              isInvalid={
                (!validInputPattern.test(textAreaInput)) && formSubmitted
              }
              isValid={validInputPattern.test(textAreaInput)}
              onChange={(event) => {
                setTextAreaInput(event?.target.value);
                setFormSubmitted(false);
              }}
              required
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
            <Form.Control type="hidden" name="intent" value="create-request" />
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
