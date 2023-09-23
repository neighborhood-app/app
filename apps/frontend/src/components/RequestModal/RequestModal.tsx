import { Modal, Spinner } from "react-bootstrap";
import styles from './RequestModal.module.css';
import { RequestType, ResponseWithUser } from "../../types";
import requestServices from "../../services/requests";
import { useState } from "react";
import { useRevalidator } from "react-router";
import ResponseBox from '../ResponseBox/ResponseBox'
import SubmitBtn from "../SubmitButton/SubmitBtn";
import DangerBtn from "../DangerButton/DangerBtn";

interface Props {
  show: boolean,
  handleCloseModal: () => void,
  request: RequestType,
  updateRequestList: (requests: Array<RequestType>) => void,
}

export default function RequestModal({ show, handleCloseModal, request }: Props) {
  const [loading, setIsLoading] = useState(false);
  const revalidator = useRevalidator();

  async function handleCloseRequest() {
    try {
      setIsLoading(true);
      await requestServices.closeRequest(String(request.id))
      setIsLoading(false);
      handleCloseModal();
      revalidator.revalidate();
      
    } catch(e) {
      setIsLoading(false);
      console.log(e);
    }
  }

  const responses = request.responses.map((responseObj: ResponseWithUser)=> {
    return (
      <ResponseBox response={responseObj} key={responseObj.id}/>
    ) 
  })
 
  /**
  * Based on the status of a user (creator, or viewer) and the status of the request 
  (OPEN or CLOSED) returns the corresponding JSX for the request modal.
  */
  function displayRequestActions(request: RequestType) {
    let user = localStorage.getItem('user');
    let username = user ? JSON.parse(user).username : null;
    if (username === request.user.username && request.status === "OPEN") {
      return (
        <DangerBtn onClick={handleCloseRequest}>Close request</DangerBtn>
      );
    } else if (!(username === request.user.username) && request.status === "OPEN") {
      return (
        <SubmitBtn>Offer help</SubmitBtn>
      );
    }
  }

  return (
    <div onClick={e => e.stopPropagation()}>
      <Modal show={show} onHide={handleCloseModal} animation={true} backdrop="static" centered className={styles.modal} dialogClassName="modal-w200" size="xl">
        <Modal.Header closeButton>
          {request.user.username}
        </Modal.Header>
        <Modal.Body>
        <section className={styles.currentRequestInfo}>
          <img
            src={require('./images/image.jpeg')}
            alt="active request on neighborhood app"
            className={styles.requestImage}
            />
          <div className={styles.requestContent}>
            <h1 className={styles.h1}>{request.title}</h1>
            <p className={styles.p}>{request.content}</p>
            <div className={styles.buttonGroups}>
              {displayRequestActions(request)}
              {loading ? <Spinner animation="border" /> : null}
            </div>
          </div>
        </section>
        <section className={styles.responseSection}>
          {responses}
        </section>
        </Modal.Body>
      </Modal>
    </div>
  )
}
