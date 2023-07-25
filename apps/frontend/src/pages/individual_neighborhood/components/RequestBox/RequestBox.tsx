import SearchFilterForm from "../SearchFilterForm/SearchFilterForm";
import Request from "../Request/Request";
import RequestModal from '../RequestModal/RequestModal'
import styles from './RequestBox.module.css';
import { Button } from "react-bootstrap";
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
      <SearchFilterForm filterStatus={requestsType} setFilterStatus={setRequestsType} />
      <Button className={styles.button} onClick={handleShow}>Create request</Button>
      <RequestModal show={show} handleClose={handleClose}/>
      {requestBoxes}
    </div>
  )
}

