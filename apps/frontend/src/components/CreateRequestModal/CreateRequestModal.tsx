import { Modal, Form } from "react-bootstrap";
import { Form as FormRouter } from 'react-router-dom';
import styles from './CreateRequestModal.module.css';
import CustomBtn from "../CustomBtn/CustomBtn";

interface Props {
  show: boolean,
  handleClose: () => void,
}

export default function CreateRequestModal({ show, handleClose }: Props) {
  const closeModal = () => handleClose();

  return (
    <Modal show={show} onHide={handleClose} animation={true} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create a request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <FormRouter method='post' role='form' onSubmit={closeModal} className={styles.createReqForm}>
          <Form.Group className={`mb-3`} controlId='title'>
            <Form.Label column='sm'>Title</Form.Label>
            <Form.Control type='text' name='title' placeholder='' minLength={4} required />
          </Form.Group>
          <Form.Group className='mb-3' controlId='content'>
            <Form.Label column='sm'>Content</Form.Label>
            <Form.Control as="textarea" rows={3} name='content' required />
          </Form.Group>
          <div className='d-grid gap-2'>
            <CustomBtn variant='primary' type='submit'>Submit</CustomBtn>
            <CustomBtn variant='outline-dark' onClick={closeModal}>Cancel</CustomBtn>
          </div>
        </FormRouter>
      </Modal.Body>
    </Modal>
  )
}
