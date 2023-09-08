import { Modal } from "react-bootstrap";
import styles from './RequestModal.module.css';
import { RequestType } from "../../types";
import requestServices from "../../services/requests";

interface Props {
  show: boolean,
  handleClose: () => void,
  request: RequestType,
}

export default function RequestModal({ show, handleClose, request }: Props) {
  async function handleCloseRequest() {
    await requestServices.closeRequest(String(request.id))
  }

  return (
    <div onClick={e => e.stopPropagation()}>
      <Modal show={show} onHide={handleClose} animation={true} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>{request.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {request.content}
          <button onClick={handleCloseRequest}>Close Request</button>
        </Modal.Body>
      </Modal>
    </div>
  )
}
