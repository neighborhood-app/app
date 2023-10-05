import { Modal, Form, Container, Row, Col } from "react-bootstrap";
import { Form as FormRouter } from 'react-router-dom';
import styles from './CreateRequestModal.module.css';
import CustomBtn from "../CustomBtn/CustomBtn";

// add bootstrap validation

interface Props {
  show: boolean,
  handleClose: () => void,
}

export default function CreateRequestModal({ show, handleClose }: Props) {
  const closeModal = () => handleClose();

  return (
    <Modal show={show} onHide={handleClose} animation={true} backdrop='static' centered>
      <Modal.Header closeButton>
        <Modal.Title>Create a request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <FormRouter method='post' role='form' onSubmit={closeModal} className={styles.createReqForm}>
          <Form.Group className='mb-3' controlId='title'>
            <Form.Label column='sm'>Title<span className={styles.asterisk}>*</span></Form.Label>
            <Form.Control type='text' name='title' placeholder='' minLength={4} required />
          </Form.Group>
          <Form.Group className='mb-2' controlId='content'>
            <Form.Label column='sm'>Content<span className={styles.asterisk}>*</span></Form.Label>
            <Form.Control as="textarea" rows={4} name='content' required />
          </Form.Group>
          <Form.Group className='mb-3'>
          <Form.Text className='text-muted'>
            Fields marked with <span className={styles.asterisk}>*</span> are required.
          </Form.Text>
          </Form.Group>
          <Container className={styles.btnContainer} fluid>
            <Row className="gx-3 gy-2">
              <Col sm={6}>
                <CustomBtn variant='primary' type='submit' className={`${styles.btn}`}>Submit</CustomBtn>
              </Col>
              <Col sm={6}>
                <CustomBtn variant='outline-dark' onClick={closeModal} className={styles.btn}>Cancel</CustomBtn>
              </Col>
            </Row>
          </Container>
        </FormRouter>
      </Modal.Body>
      {/* <Modal.Footer>
          <CustomBtn variant='primary' type='submit'>Submit</CustomBtn>
          <CustomBtn variant='outline-dark' onClick={closeModal}>Cancel</CustomBtn>
      </Modal.Footer> */}
    </Modal>
  )
}
