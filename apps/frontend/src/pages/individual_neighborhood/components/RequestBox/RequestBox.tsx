import SearchFilterForm from "../SearchFilterForm/SearchFilterForm";
import Request from "../Request/Request";
import styles from './RequestBox.module.css';
import { Button } from "react-bootstrap";
import { useState } from "react";

//@ts-ignore
export default function RequestBox({ requests }) {
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
      <Button className={styles.button}>Create request</Button>
      {requestBoxes}
    </div>
  )
}

