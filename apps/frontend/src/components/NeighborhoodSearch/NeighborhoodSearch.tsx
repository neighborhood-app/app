import { useEffect, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { Neighborhood } from '@neighborhood/backend/src/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './NeighborhoodSearch.module.css';
import NeighborhoodCard from '../NeighborhoodCard/NeighborhoodCard';
import CustomBtn from '../CustomBtn/CustomBtn';
import CreateNeighborhoodModal from '../CreateNeighborhoodModal/CreateNeighborhoodModal';
// import neighborhoodServices from '../../services/neighborhoods';

export default function NeighborhoodSearch({
  neighborhoods,
  hasNextPage,
}: {
  neighborhoods: Neighborhood[];
  hasNextPage: boolean;
}) {
  // const submit = useSubmit();
  const loaderData = useLoaderData() as { neighborhoods: Neighborhood[]; hasNextPage: boolean };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [neighborhoodList, setNeighborhoodList] = useState(neighborhoods);
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  const [partialNhoods, setPartialNhoods] = useState(neighborhoods || []);
  const [cursor, setCursor] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams(`cursor=${cursor}`);
  const [hasMore, setHasMore] = useState(hasNextPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError]: [error: Error | null, setError: Dispatch<SetStateAction<null | Error>>] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchData = async () => {
    setIsLoading(true);
    // setError(null);

    try {      
      setSearchParams(`cursor=${cursor}`);
      // const searchParams = new URLSearchParams();
      // searchParams.append('limit', NHOODS_PER_PAGE);
      // searchParams.append('cursor', String(cursor));
      // submit(searchParams, {
      //   action: '/explore',
      // });

      // const response = await neighborhoodServices.getNeighborhoodsPerPage(12, cursor);
      console.log({searchParams, loaderData});

      setPartialNhoods((prevItems) => [...prevItems, ...loaderData.neighborhoods ]);
      setHasMore(loaderData.hasNextPage);
      setCursor((_) => {
        const lastNeighborhood = partialNhoods[partialNhoods.length - 1];
        return lastNeighborhood ? lastNeighborhood.id : 0;
      });
    } catch (error) {
      // setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filteredNeighborhoods = neighborhoods;

    if (searchTerm !== '') {
      filteredNeighborhoods =
        filteredNeighborhoods?.filter((neighborhood) =>
          neighborhood.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ) || [];
    }

    setNeighborhoodList(filteredNeighborhoods);
    setPartialNhoods(filteredNeighborhoods || []);
  }, [neighborhoods, searchTerm]);

  const searchNeighborhoods = (searchInput: string): void => {
    setSearchTerm(searchInput);
  };

  const neighborhoodBoxes =
    partialNhoods.map((neighborhood: Neighborhood) => (
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
            dataLength={12}
            next={fetchData}
            hasMore={hasMore}
            loader={<p>Loading...</p>}
            endMessage={<p>You've seen all the Neighborhoods!</p>}>
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
