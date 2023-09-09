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
    try {
      await requestServices.closeRequest(String(request.id))
    } catch(e) {
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
      <Modal show={show} onHide={handleClose} animation={true} backdrop="static" centered className={styles.modal} dialogClassName="modal-w200" size="xl">
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
            </div>
          </div>
        </section>
          
        </Modal.Body>
      </Modal>
    </div>
  )
}
