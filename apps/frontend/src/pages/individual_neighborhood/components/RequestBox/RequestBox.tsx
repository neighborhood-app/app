import SearchFilterForm from "../SearchFilterForm/SearchFilterForm";
import Request from "../Request/Request";
import styles from './RequestBox.module.css';
import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";

// @ts-ignore
export default function RequestBox({ requests }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [requestsType, setRequestsType] = useState('open');
  let requestSelection;
  if (requestsType === 'open') {
    //@ts-ignore
    requestSelection = requests.filter(request => {
      return request.status === 'OPEN';
    })
  } else if (requestsType === 'closed') {
    //@ts-ignore
    requestSelection = requests.filter(request => {
      return request.status === 'CLOSED';
    })
  } else {
    requestSelection = requests;
  }
  //@ts-ignore
  const requestBoxes = requestSelection.map(request => {
    return (
      <Request requestObj={request} key={request.id}></Request>
    )
  })

  return (
    <div className={styles.column}>
      <SearchFilterForm filterStatus={ requestsType } setFilterStatus={ setRequestsType }/>
      <Button className={styles.button} onClick={handleShow}>Create request</Button>
      <Modal show={show} onHide={handleClose} animation={true} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create a request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Title of your request" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formContent">
              <Form.Label>Password</Form.Label>
              <Form.Control type="text" placeholder="Content of your request" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {requestBoxes}
    </div>
  )
}

