import { useEffect, useState } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { Neighborhood } from '@neighborhood/backend/src/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './NeighborhoodSearch.module.css';
import NeighborhoodCard from '../NeighborhoodCard/NeighborhoodCard';
import CustomBtn from '../CustomBtn/CustomBtn';

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
  };

  const neighborhoodBoxes =
    neighborhoodList?.map((neighborhood: Neighborhood) => (
      <Col className="" sm="6" md="4" lg="3" key={neighborhood.id}>
        <NeighborhoodCard
          id={neighborhood.id}
          name={neighborhood.name}
          description={neighborhood.description}
          isUserAdmin={false}></NeighborhoodCard>
      </Col>
    )) || [];

  return (
    <>
      <Container className={`${styles.searchBox} mt-4 mb-5`} fluid>
        <Row className="mt-1 gy-3 justify-content-center justify-content-sm-end">
          <Col className={`mx-sm-auto ${styles.searchCol}`} lg="4" sm="6" xs="auto">
            <Form>
              <Form.Group>
                <Form.Control
                  className={styles.searchInput}
                  type="text"
                  placeholder="S e a r c h"
                  value={searchTerm}
                  onChange={(event) => searchNeighborhoods(event.target.value)}></Form.Control>
              </Form.Group>
            </Form>
          </Col>
          <Col xs="auto" sm="auto" className="me-sm-4">
            <CustomBtn className={styles.iconBtn} variant="primary" title="Create a new neighborhood">
              <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
            </CustomBtn>
          </Col>
        </Row>
      </Container>
      <Container className={styles.neighborhoodsContainer} fluid>
        <Row className="gy-sm-4 gx-sm-4">
          {neighborhoodBoxes.length > 0 ? (
            neighborhoodBoxes
          ) : (
            <Col className={styles.noNhoodsText}>
              <p>Currently, there are no neighborhoods that match your criteria.</p>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}
