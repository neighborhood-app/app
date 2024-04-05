import { useEffect, useRef, useState } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { Neighborhood, NeighborhoodsPerPage } from '@neighborhood/backend/src/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosError } from 'axios';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './NeighborhoodSearch.module.css';
import NeighborhoodCard from '../NeighborhoodCard/NeighborhoodCard';
import CustomBtn from '../CustomBtn/CustomBtn';
import NeighborhoodModalForm from '../../components/NeighborhoodModalForm/NeighborhoodModalForm';
import neighborhoodsService from '../../services/neighborhoods';
import SpinWheel from '../SpinWheel/SpinWheel';
import AlertBox from '../AlertBox/AlertBox';
import { ErrorObj } from '../../types';

export default function NeighborhoodSearch({
  neighborhoods,
  cursor,
  isNextPage,
}: {
  neighborhoods: Neighborhood[];
  cursor?: number;
  isNextPage: boolean;
}) {
  const cursorRef = useRef(cursor);
  const nextPageRef = useRef(isNextPage);
  const [neighborhoodList, setNeighborhoodList] = useState(neighborhoods);
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchData = async function fetchData() {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const data = (await neighborhoodsService.getNeighborhoods(
        cursorRef.current,
      )) as unknown as NeighborhoodsPerPage;

      setNeighborhoodList(neighborhoodList.concat(data.neighborhoods));
      cursorRef.current = data.newCursor;
      nextPageRef.current = data.hasNextPage;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorResponse: ErrorObj = error.response?.data;
        setErrorMsg(errorResponse.error);
      } else if (error instanceof Error) {
        setErrorMsg(error.message);
      }

      window.scrollTo(0, 0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filteredNeighborhoods: Neighborhood[] | null = [];

    const timeout = setTimeout(async () => {
      if (searchTerm.length > 0) {
        setIsLoading(true);
        setErrorMsg('');
        // Prevent infinite scroll component from fetching more hoods when scrolling
        // through the search results
        nextPageRef.current = false;

        try {
          // TODO: paginate/infinite-scroll those results as well
          filteredNeighborhoods = await neighborhoodsService.filterByName(searchTerm);
          setNeighborhoodList(filteredNeighborhoods);
        } catch (error) {
          if (error instanceof AxiosError) {
            const errorResponse: ErrorObj = error.response?.data;
            setErrorMsg(errorResponse.error);
          } else if (error instanceof Error) {
            setErrorMsg(error.message);
          }

          window.scrollTo(0, 0);
        } finally {
          setIsLoading(false);
        }
      } else {
        const lastNhoodId: number | undefined = neighborhoods.slice(-1)[0]?.id;

        nextPageRef.current = isNextPage;
        cursorRef.current = lastNhoodId;
        setNeighborhoodList(neighborhoods || []);
        setIsLoading(false);
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
            <Form onSubmit={(event) => event.preventDefault()}>
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
              title="Create a new neighbourhood"
              onClick={handleShow}>
              <FontAwesomeIcon className={styles.plusIcon} icon={faPlus}></FontAwesomeIcon>
            </CustomBtn>
          </Col>
        </Row>
      </Container>
      <Container className={styles.neighborhoodsContainer} fluid>
        {errorMsg && <AlertBox text={errorMsg} variant="danger"></AlertBox>}
        {neighborhoodBoxes.length > 0 ? (
          <InfiniteScroll
            dataLength={neighborhoodBoxes.length}
            next={fetchData}
            hasMore={nextPageRef.current}
            loader={<SpinWheel className={`mt-5 mx-auto`}></SpinWheel>}
            className={styles.scrollBox}>
            <Row className="gy-sm-4 gx-sm-4">{neighborhoodBoxes}</Row>
          </InfiniteScroll>
        ) : (
          <Col className={styles.noNhoodsText}>
            <p>Currently, there are no neighbourhoods that match your criteria.</p>
          </Col>
        )}
      </Container>
      <NeighborhoodModalForm
        show={show}
        handleClose={handleClose}
        intent="create-neighborhood"
        action="/"
      />
    </>
  );
}
