import { Modal } from "react-bootstrap";
import { Form } from 'react-router-dom';
import styles from './CreateRequestModal.module.css';
import SubmitBtn from "../SubmitButton/SubmitBtn";
import LinkBtn from "../LinkButton/LinkBtn";

interface Props {
  show: boolean,
  handleClose: () => void,
}

export default function CreateRequestModal({ show, handleClose }: Props) {
  function handleSubmit() {
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose} animation={true} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create a request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form method='post' className={styles.form} name='new-request-form'>
          <label className={styles.label} htmlFor='title'>Title:</label>
          <input className={styles.input} type='text' name='title' id='title' required minLength={4}></input>

          <label className={styles.label} htmlFor='content'>Content:</label>
          <textarea className={styles.textarea} name='content' id='content' required></textarea>

          <div className={styles.buttonContainer}>
            <SubmitBtn type='submit'  onClick={handleSubmit}>Submit</SubmitBtn>
            <LinkBtn onClick={() => handleClose()}>Cancel</LinkBtn>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
