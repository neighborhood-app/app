import { useEffect, useState } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import Request from '../Request/Request';
import CreateRequestModal from '../CreateRequestModal/CreateRequestModal';
import styles from './RequestBox.module.css';
import { RequestWithUserAndResponses } from '../../types';
import CustomBtn from '../CustomBtn/CustomBtn';

export default function RequestBox({
  requests,
}: {
  requests: RequestWithUserAndResponses[] | null;
}) {
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
      <Col className={`${styles.requestCol} pe-0`} sm="6" md="4" lg="3" key={request.id}>
        <Request requestObj={request} key={request.id}></Request>
      </Col>
    )) || [];

  return (
    <Container className="pe-0" fluid>
      <Row className="me-0 mt-3 mb-1">
        <Col>
          <h2 className={styles.title}>Neighborhood Requests</h2>
        </Col>
      </Row>
      <Row className="me-0">
        <Col>
          <CustomBtn variant="primary" className={styles.button} onClick={handleShow}>
            Create request
          </CustomBtn>
        </Col>
      </Row>

      <Form>
        <Row className="mt-1 gy-3" xs="1" sm="2" lg="3" xl="4">
          <Col>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search requests by title"
                value={searchCriteria.searchTerm}
                onChange={(event) => searchRequests(event.target.value)}></Form.Control>
            </Form.Group>
          </Col>
          <Col className={styles.statusColumn}>
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
      <Row
        xs="1"
        sm="auto"
        className="mt-1 me-0 gy-sm-4 gx-xl-5 gx-sm-4 justify-content-xl-start justify-content-lg-between justify-content-center">
        {requestBoxes.length !== 0 ? (
          requestBoxes
        ) : (
          <p className="mt-4">Currently, there are no requests that match your criteria.</p>
        )}
      </Row>
    </Container>
  );
}
