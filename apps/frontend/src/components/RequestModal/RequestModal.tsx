import { Modal, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import { useRevalidator } from 'react-router';
import styles from './RequestModal.module.css';
import { RequestType, ResponseWithUserAndRequest } from '../../types';
import requestServices from '../../services/requests';
import ResponseBox from '../ResponseBox/ResponseBox';
import CustomBtn from '../CustomBtn/CustomBtn';
import StatusHeader from '../StatusHeader/StatusHeader';

const requestImg = require('./images/image.jpeg');

interface Props {
  show: boolean;
  handleCloseModal: () => void;
  request: RequestType;
}

export default function RequestModal({ show, handleCloseModal, request }: Props) {
  const [loading, setIsLoading] = useState(false);
  const revalidator = useRevalidator();

  async function handleCloseRequest() {
    try {
      setIsLoading(true);
      await requestServices.closeRequest(String(request.id));
      await requestServices.closeRequest(String(request.id));
      setIsLoading(false);
      handleCloseModal();
      revalidator.revalidate();
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  }

  const responses = request.responses.map((responseObj: ResponseWithUserAndRequest) => (
    <ResponseBox response={responseObj} requestOwnerId={request.user_id} key={responseObj.id} />
  ));

  /**
  * Based on the status of a user (creator, or viewer) and the status of the request 
  (OPEN or CLOSED) returns the corresponding JSX for the request modal.
  */
  function displayRequestActions() {
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).username : null;
    if (username === request.user.username && request.status === 'OPEN') {
      return (
        <CustomBtn variant="danger" onClick={handleCloseRequest}>
          Close request
        </CustomBtn>
      );
    } else if (request.status === 'OPEN') {
      return <CustomBtn variant="primary">Offer help</CustomBtn>;
    }

    return null;
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal
        show={show}
        onHide={handleCloseModal}
        animation={true}
        backdrop="static"
        centered
        className={styles.modal}
        dialogClassName="modal-w200"
        size="xl">
        <Modal.Header closeButton>{request.user.username}</Modal.Header>
        <Modal.Body>
          <section className={styles.currentRequestInfo}>
            <img
              src={requestImg}
              alt="active request on neighborhood app"
              className={styles.requestImage}
            />
            <div className={styles.requestContent}>
              <h1 className={styles.h1}>{request.title}</h1>
              <p className={styles.p}>{request.content}</p>
              <div className={styles.buttonGroups}>
                {displayRequestActions()}
                {loading ? <Spinner animation="border" /> : null}
              </div>
            </div>
            <StatusHeader status={request.status} />
          </section>
          <section className={styles.responseSection}>{responses}</section>
        </Modal.Body>
      </Modal>
    </div>
  );
}
