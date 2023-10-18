import { Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { useParams, useSubmit } from 'react-router-dom';
import { FormEvent, FocusEvent, ChangeEvent, useState } from 'react';
import styles from './CreateRequestModal.module.css';
import CustomBtn from '../CustomBtn/CustomBtn';

interface Props {
  show: boolean;
  handleClose: () => void;
}

export default function CreateRequestModal({ show, handleClose }: Props) {
  const [validated, setValidated] = useState(false);
  const { id: neighborhoodId } = useParams();
  const submit = useSubmit();
  const closeModal = () => {
    handleClose();
    setValidated(false);
  };

  const validateTextArea = (event: FocusEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget as HTMLTextAreaElement;
    const validPattern = /\s*(\S\s*){4,}/;

    if (!validPattern.test(textarea.value)) {
      textarea.setCustomValidity('The content needs to be at least 4 characters long.');
    } else {
      textarea.setCustomValidity('');
    }

    textarea.reportValidity();
  };

  const hideValidation = (event: ChangeEvent<HTMLTextAreaElement>) =>
    event.currentTarget.setCustomValidity('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();

      setValidated(true);
    } else {
      submit(form, {
        method: 'post',
        action: `/neighborhoods/${neighborhoodId}`,
      });
      closeModal();
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
          validated={validated}
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
              pattern="\s*(\S\s*){4,}"
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
              minLength={4}
              onChange={hideValidation}
              onBlur={validateTextArea}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please input some explanatory content.
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
