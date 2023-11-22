import { useEffect, useState } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { Neighborhood } from '@neighborhood/backend/src/types';
import styles from './NeighborhoodSearch.module.css';

export default function NeighborhoodSearch({
  neighborhoods,
}: {
  neighborhoods: Neighborhood[] | null;
}) {
  const [neighborhoodList, setNeighborhoodList] = useState(neighborhoods);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filteredNeighborhoods = neighborhoods;

    if (searchTerm !== '') {
      filteredNeighborhoods =
        filteredNeighborhoods?.filter((neighborhood) =>
          neighborhood.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ) || [];
    }

    setNeighborhoodList(filteredNeighborhoods);
  }, [neighborhoods, searchTerm]);

  const searchNeighborhoods = (searchInput: string): void => {
    setSearchTerm(searchInput);
  }

  const neighborhoodBoxes =
    neighborhoodList?.map((neighborhood: Neighborhood) => (
      <Col className={`${styles.requestCol} pe-0`} sm="6" md="4" lg="3" key={neighborhood.id}>
        {/* the Neighborhood card will go here */}
        {neighborhood.name}
      </Col>
    )) || [];

  return (
    <>
      <Container className="mt-4 mb-5" fluid>
        <Row className="mt-1 gy-3 justify-content-center">
          <Col lg="4" sm="5" xs="7">
            <Form>
              <Form.Group>
                <Form.Control
                  className={styles.searchInput}
                  type="text"
                  placeholder="S e a r c h"
                  value={searchTerm}
                  onChange={event => searchNeighborhoods(event.target.value)}></Form.Control>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>{neighborhoodBoxes}</Row>
      </Container>
    </>
  );
}