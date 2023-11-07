import { useEffect, useState } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import Request from '../Request/Request';
import CreateRequestModal from '../CreateRequestModal/CreateRequestModal';
import styles from './RequestBox.module.css';
import { RequestWithUserAndResponses } from '../../types';
import CustomBtn from '../CustomBtn/CustomBtn';

export default function RequestBox({ requests }: { requests: RequestWithUserAndResponses[] | null }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [requestList, setRequestList] = useState(requests);
  const [searchCriteria, setSearchCriteria] = useState({ status: 'ALL', searchTerm: '' });

  useEffect(() => {
    let filteredRequests;
    if (searchCriteria.status === 'ALL') {
      filteredRequests = requests;
    } else {
      filteredRequests =
        requests?.filter(
          (request: RequestWithUserAndResponses) => request.status === searchCriteria.status,
        ) || [];
    }

    if (searchCriteria.searchTerm !== '') {
      filteredRequests =
        filteredRequests?.filter((request: RequestWithUserAndResponses) =>
          request.title.toLowerCase().includes(searchCriteria.searchTerm.toLowerCase()),
        ) || [];
    }

    setRequestList(filteredRequests);
  }, [requests, searchCriteria]);

  function filterRequests(requestsType: string): void {
    setSearchCriteria({ status: requestsType, searchTerm: '' });
  }

  function searchRequests(searchInput: string): void {
    setSearchCriteria((oldCriteria) => ({ ...oldCriteria, searchTerm: searchInput }));
  }

  const requestBoxes =
    requestList?.map((request: RequestWithUserAndResponses) => (
      <Col className={styles.column}>
        <Request requestObj={request} key={request.id}></Request>
      </Col>
    )) || [];

  return (
    <Container fluid className={styles.container}>
      <Row>
        <Col>
          <h2 className={styles.title}>Neighborhood Requests</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <CustomBtn variant="primary" className={styles.button} onClick={handleShow}>
            Create request
          </CustomBtn>
        </Col>
      </Row>

      <Form>
        <Row className={styles.formRow} xs="1" sm="2" lg="3" xl="4">
          <Col className={styles.column}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search requests by title"
                value={searchCriteria.searchTerm}
                onChange={(event) => searchRequests(event.target.value)}></Form.Control>
            </Form.Group>
          </Col>
          <Col className={`${styles.column} ${styles.statusColumn}`}>
            <Form.Group>
              <Form.Select
                size="sm"
                className={styles.selectBox}
                value={searchCriteria.status}
                onChange={(event) => filterRequests(event.target.value)}>
                <option value="OPEN">Open Requests</option>
                <option value="CLOSED">Closed Requests</option>
                <option value="ALL">All Requests</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <CreateRequestModal show={show} handleClose={handleClose} />
      <Row xs="1" lg="auto" className={styles.requestRow}>
        {requestBoxes.length !== 0 ? (
          requestBoxes
        ) : (
          <p className="mt-2">Currently there are no requests that match your criteria!</p>
        )}
      </Row>
    </Container>
  );
}
