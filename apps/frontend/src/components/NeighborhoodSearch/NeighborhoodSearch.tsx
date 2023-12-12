import { useState } from 'react';
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

export default function NeighborhoodSearch({
  neighborhoods,
  hasNextPage,
  lastCursor,
}: {
  neighborhoods: Neighborhood[];
  hasNextPage: boolean;
  lastCursor: string;
  }) {
  const data = useLoaderData()  as {
    neighborhoods: Neighborhood[];
    hasNextPage: boolean;
    cursor: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams() 
  // const submit = useSubmit();
  // const actionData = useActionData() as {
  //   neighborhoods: Neighborhood[];
  //   hasNextPage: boolean;
  //   newCursor: string;
  // };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [neighborhoodList, setNeighborhoodList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [partialNhoods, setPartialNhoods] = useState(neighborhoods);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cursor, setCursor] = useState(lastCursor);
  // console.log('in component', { partialNhoods, cursor });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError]: [error: Error | null, setError: Dispatch<SetStateAction<null | Error>>] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // fetch the next batch of data by triggering the action
  // useEffect(() => {
  //   try {
  //     submit(
  //       { cursor },
  //       {
  //         action: '/explore',
  //         method: 'post',
  //       },
  //     );
  //     // setPartialNhoods((prevItems) => [...prevItems, ...actionData.neighborhoods]);
  //     // setCursor((_) => {
  //     //   const { newCursor } = actionData;
  //     //   console.log({ newCursor });

  //     //   return newCursor; // newCursor could be undefined
  //     // });

  //     // console.log('cursor after resetting in outside action call:', cursor);
  //   } catch (error) {
  //     // setError(error as Error);
  //   }
  // }, [cursor])

  const fetchData = async () => {
    setIsLoading(true);
    // setError(null);
    // try {
    setSearchParams({ cursor });
    setCursor(data.cursor);
    setPartialNhoods((prevItems) => {
      const uniqueNhoods = new Set<Neighborhood>(prevItems.concat(data.neighborhoods))
      return [...uniqueNhoods]
    });

    // submit(
    //   { cursor },
    //   {
    //     action: '/explore',
    //     method: 'post',
    //   },
    // );

    // setPartialNhoods((prevItems) => [...prevItems, ...actionData.neighborhoods]);
    // setCursor((_) => {
    //   const { newCursor } = actionData;
    //   console.log({ newCursor });

    //   return newCursor; // newCursor could be undefined
    // });
    console.log('loader data', data);

    // console.log('cursor after resetting:', cursor);
    // } catch (error) {
    //   // setError(error as Error);
    // } finally {
    setIsLoading(false);
    // }
  };

  // useEffect(() => {
  //   let filteredNeighborhoods = neighborhoods;

  //   if (searchTerm !== '') {
  //     filteredNeighborhoods =
  //       filteredNeighborhoods?.filter((neighborhood) =>
  //         neighborhood.name.toLowerCase().includes(searchTerm.toLowerCase()),
  //       ) || [];
  //   }

  //   setNeighborhoodList(filteredNeighborhoods);
  //   setPartialNhoods(filteredNeighborhoods || []);
  // }, [neighborhoods, searchTerm]);

  const searchNeighborhoods = (searchInput: string): void => {
    setSearchTerm(searchInput);
  };

  // eslint-disable-next-line arrow-body-style
  const neighborhoodBoxes = partialNhoods.map((neighborhood: Neighborhood) => {
    if (neighborhood === undefined) console.log('here');

    return (
      (
        <Col className="" sm="6" md="4" lg="3" key={neighborhood.id}>
          <NeighborhoodCard
            id={neighborhood.id}
            name={neighborhood.name}
            description={neighborhood.description}
            isUserAdmin={false}></NeighborhoodCard>
        </Col>
      ) || []
    );
  });

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
            dataLength={12} // move this into a constant
            next={fetchData}
            hasMore={hasNextPage}
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
