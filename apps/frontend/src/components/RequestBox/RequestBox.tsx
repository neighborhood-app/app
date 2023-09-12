import Request from "../Request/Request";
import CreateRequestModal from "../CreateRequestModal/CreateRequestModal";
import styles from "./RequestBox.module.css";
import { RequestType } from "../../types";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

//@ts-ignore
export default function RequestBox({ requests }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [requestList, setRequestList] = useState(requests);
  const [searchCriteria, setSearchCriteria] = useState({ status: 'ALL', searchTerm: '' })

  useEffect(() => {
    let filteredRequests;
    if (searchCriteria.status === 'ALL') {
      filteredRequests = requests;
    } else {
      filteredRequests = requests.filter((request: RequestType) => {
        return request.status === searchCriteria.status;
      })
    }
    setRequestList(filteredRequests);
  }, [requests, searchCriteria]);

  function filterRequests(requestsType: string): void {
    setSearchCriteria({status: requestsType, searchTerm: ''});
  };

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
            <Form.Select size='sm' className={styles.selectBox} value={searchCriteria.status}
              onChange={event => filterRequests((event.target).value)}>
              <option value='OPEN'>Open Requests</option>
              <option value='CLOSED'>Closed Requests</option>
              <option value='ALL'>All Requests</option>
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
