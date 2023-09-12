import Request from "../Request/Request";
import CreateRequestModal from "../CreateRequestModal/CreateRequestModal";
import styles from "./RequestBox.module.css";
import { RequestType } from "../../types";
import { useState } from "react";
import { Form } from "react-bootstrap";

//@ts-ignore
export default function RequestBox({ requests }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [requestList, setRequestList] = useState(requests);

  function filterRequests(requestsType: string): void {
    if (requestsType === "open") {
      setRequestList(requests.filter((request: RequestType) => {
        return request.status === "OPEN";
      }));
    } else if (requestsType === "closed") {
      setRequestList(requests.filter((request: RequestType) => {
        return request.status === "CLOSED";
      }));
    } else if (requestsType === "all") {
      setRequestList(requests);
    }
  }

  function searchRequests(searchInput: string): void {
    if (searchInput !== "") {
      setRequestList(requestList.filter((request: RequestType) => {
        return request.title.toLowerCase().includes(searchInput.toLowerCase());
      }));
    } else {
      setRequestList(requests);
    }
  }

  const requestBoxes = requestList.map((request: RequestType) => {
    return <Request requestObj={request} key={request.id}></Request>;
  });

  return (
    <div className={styles.header}>
      <h2 className={styles.title}>Neighborhood Requests</h2>
      <button className={styles.button} onClick={handleShow}>
        Create request
      </button>
      <div className={styles.form}>
        <Form className={styles.form}>
          <Form.Group>
            <Form.Control type="text" placeholder="Search requests by title" onChange={event => searchRequests((event.target).value)}></Form.Control>
          </Form.Group>
          <div className={styles.inputGroup}>
            <Form.Select size='sm' className={styles.selectBox}
              onChange={event => filterRequests((event.target).value)}>
              <option value='open'>Open Requests</option>
              <option value='closed'>Closed Requests</option>
              <option value='all'>All Requests</option>
            </Form.Select>
          </div>
        </Form>
      </div>
      <CreateRequestModal show={show} handleClose={handleClose} />
      <div className={styles.container}>
        {requestBoxes.length !== 0 ? requestBoxes : 'Currently there are no requests that match your criteria!'}
      </div>
    </div>
  );
}
