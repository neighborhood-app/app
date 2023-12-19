import { useEffect, useState } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { Neighborhood, NeighborhoodsPerPage } from '@neighborhood/backend/src/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './NeighborhoodSearch.module.css';
import NeighborhoodCard from '../NeighborhoodCard/NeighborhoodCard';
import CustomBtn from '../CustomBtn/CustomBtn';
import CreateNeighborhoodModal from '../CreateNeighborhoodModal/CreateNeighborhoodModal';
import neighborhoodsService from '../../services/neighborhoods';
import SpinWheel from '../SpinWheel/SpinWheel';

export default function NeighborhoodSearch({
  neighborhoods,
  cursor,
  isNextPage,
}: {
  neighborhoods: Neighborhood[];
  cursor: number;
  isNextPage: boolean;
}) {
  const [neighborhoodList, setNeighborhoodList] = useState(neighborhoods);
  const [hasNextPage, setHasNextPage] = useState(isNextPage);
  const [currentCursor, setCurrentCursor] = useState(cursor);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchData = async function fetchData() {
    setIsLoading(true);
    const data = (await neighborhoodsService.getNeighborhoods(
      currentCursor,
    )) as unknown as NeighborhoodsPerPage;

    setNeighborhoodList(neighborhoodList.concat(data.neighborhoods));
    setCurrentCursor(data.currentCursor);
    setHasNextPage(data.hasNextPage);
    setIsLoading(false);
  };

  // const fetchData = async () => {
  //   setIsLoading(true);
  //   // setError(null);
  //   // try {
  //   // } catch (error) {
  //   //   // setError(error as Error);
  //   // } finally {
  //   setIsLoading(false);
  //   // }
  // };

  useEffect(() => {
    let filteredNeighborhoods: Neighborhood[] | null = [];

    const timeout = setTimeout(async () => {
      if (searchTerm.length > 0) {
        try {
          setIsLoading(true);
          filteredNeighborhoods = await neighborhoodsService.filterByName(searchTerm);

          setNeighborhoodList(filteredNeighborhoods);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        const lastNhoodId = neighborhoods.slice(-1)[0].id;
        
        setHasNextPage(true)
        setCurrentCursor(lastNhoodId);
        setNeighborhoodList(neighborhoods || []);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const neighborhoodBoxes = neighborhoodList.map((neighborhood: Neighborhood) => (
    <Col className="" sm="6" md="4" lg="3" key={neighborhood.id}>
      <NeighborhoodCard
        id={neighborhood.id}
        name={neighborhood.name}
        description={neighborhood.description}
        isUserAdmin={false}></NeighborhoodCard>
    </Col>
  ));

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
                  name="searchTerm"
                  onChange={(event) => setSearchTerm(event.target.value)}></Form.Control>
              </Form.Group>
            </Form>
          </Col>
          <Col xs="auto" sm="auto" className="me-sm-4">
            <CustomBtn
              className={styles.iconBtn}
              variant="primary"
              title="Create a new neighborhood"
              onClick={handleShow}>
              <FontAwesomeIcon className={styles.plusIcon} icon={faPlus}></FontAwesomeIcon>
            </CustomBtn>
          </Col>
        </Row>
      </Container>
      <Container className={styles.neighborhoodsContainer} fluid>
        {neighborhoodBoxes.length > 0 ? (
          <InfiniteScroll
            dataLength={neighborhoodBoxes.length}
            next={fetchData}
            hasMore={hasNextPage}
            loader={<SpinWheel className={`mt-2 mx-auto`}></SpinWheel>}
            endMessage={
              <p className={`${styles.noNhoodsText} mt-5`}>You've seen all the Neighborhoods.</p>
            }
            className={styles.scrollBox}>
            <Row className="gy-sm-4 gx-sm-4">{neighborhoodBoxes}</Row>
          </InfiniteScroll>
        ) : (
          // {error && <p>Error: {error.message}</p>}
          <Col className={styles.noNhoodsText}>
            <p>Currently, there are no neighborhoods that match your criteria.</p>
          </Col>
        )}
      </Container>
      <CreateNeighborhoodModal show={show} handleClose={handleClose}></CreateNeighborhoodModal>
    </>
  );
}
