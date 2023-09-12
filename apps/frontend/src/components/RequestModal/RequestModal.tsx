import { Modal, Spinner } from "react-bootstrap";
import styles from './RequestModal.module.css';
import { RequestType } from "../../types";
import requestServices from "../../services/requests";
import { useState } from "react";
import { useRevalidator } from "react-router";

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
      //@ts-ignore
      // updateRequestList((oldList: RequestType[]) => {
      //   let newList = oldList.map(oldRequest => {
      //     if (oldRequest.id === request.id) {
      //       return {...oldRequest, status: 'CLOSED'}
      //     } else {
      //       return oldRequest;
      //     }
      //   })
      //   return newList;
      // })
      handleCloseModal();
      // navigate('.', { replace: true })
      revalidator.revalidate();
      
    } catch(e) {
      setIsLoading(false);
      console.log(e);
    }
  }

  function showCloseRequestBtn(request: RequestType) {
    let user = localStorage.getItem('user');
    let username = user ? JSON.parse(user).username : null;
    return username === request.user.user_name && request.status === "OPEN" ? true : false;
  }

  return (
    <div onClick={e => e.stopPropagation()}>
      <Modal show={show} onHide={handleCloseModal} animation={true} backdrop="static" centered className={styles.modal} dialogClassName="modal-w200" size="xl">
        <Modal.Header closeButton>
          {request.user.user_name}
        </Modal.Header>
        <Modal.Body>
        <section className={styles.currentRequestInfo}>
          <img
            src={require('./images/image.jpeg')}
            alt="active request on neighborhood app"
            className={styles.requestImage}
            />
          <div className={styles.requestContent}>
            <h1 className={styles.h1}>Help! My cat is drowning</h1>
            <p className={styles.p}>
              {request.content}
            </p>
            <div className={styles.buttonGroups}>
              {showCloseRequestBtn(request) ? <button className={`${styles.btn} ${styles.solvedBtn}`} onClick={handleCloseRequest}>Close request</button> : null}
              {loading ? <Spinner animation="border" /> : null}
            </div>
          </div>
        </section>
        </Modal.Body>
      </Modal>
    </div>
  )
}
