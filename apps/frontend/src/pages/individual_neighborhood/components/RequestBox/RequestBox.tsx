import SearchFilterForm from "../SearchFilterForm/SearchFilterForm";
import Request from "../Request/Request";
import RequestModal from '../RequestModal/RequestModal';
import styles from './RequestBox.module.css';
import { Button } from "react-bootstrap";
import { RequestType } from "../../../../types";
import { useState } from "react";


//@ts-ignore
export default function RequestBox({ requests }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [requestsType, setRequestsType] = useState('open');
  let requestSelection; 
  if (requestsType === 'open') {
    requestSelection = requests.filter((request: RequestType) => {
      return request.status === 'OPEN';
    })
  } else if (requestsType === 'closed') {
    requestSelection = requests.filter((request: RequestType) => {
      return request.status === 'CLOSED';
    })
  } else {
    requestSelection = requests;
  }

  const requestBoxes = requestSelection.map((request: RequestType) => {
    return (
      <Request requestObj={request} key={request.id}></Request>
    )
  })

  return (
    <div className={styles.column}>
      <SearchFilterForm filterStatus={requestsType} setFilterStatus={setRequestsType} />
      <Button className={styles.button} onClick={handleShow}>Create request</Button>
      <RequestModal show={show} handleClose={handleClose}/>
      {requestBoxes}
    </div>
  )
}

