import { FormEvent } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { ResponseWithUser } from '@neighborhood/backend/src/types';
import CustomBtn from '../CustomBtn/CustomBtn';
import styles from './EditResponseForm.module.css';

interface Props {
  response: ResponseWithUser;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  setShowEditForm: (showEditForm: boolean) => void;
  setContent: (content: string) => void;
  content: string;
  formSubmitted: boolean;
}

export default function EditResponseForm({
  response,
  handleSubmit,
  setShowEditForm,
  setContent,
  content,
  formSubmitted,
}: Props) {
  const validTextAreaPattern = /\s*(\S\s*){4,}/;

  return (
    <Form noValidate onSubmit={handleSubmit} role="form">
      <Form.Group className="mb-2" controlId="content">
        <Form.Label column="sm">Write the details of your help offer:</Form.Label>
        <Form.Control
          as="textarea"
          name="content"
          className="mb-3"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          minLength={4}
          required
          isInvalid={!validTextAreaPattern.test(content) && formSubmitted}
          isValid={validTextAreaPattern.test(content)}
        />
        <Form.Control.Feedback type="invalid">
          The content needs to be at least 4 characters long.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Control type="hidden" name="intent" value="edit-response" />
        <Form.Control type="hidden" name="id" value={response.id} />
      </Form.Group>
      <Container className="p-0" fluid>
        <Row className="gy-2">
          <Col>
            <CustomBtn className={styles.btn} variant="primary" type="submit">
              Submit
            </CustomBtn>
          </Col>
          <Col>
            <CustomBtn
              className={styles.btn}
              variant="outline-dark"
              onClick={() => {
                setShowEditForm(false);
                setContent(response.content);
              }}>
              Cancel
            </CustomBtn>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}
