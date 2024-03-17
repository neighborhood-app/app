import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { AxiosError } from 'axios';
import MainNav from '../../components/MainNavigation/MainNav';
import styles from './ErrorPage.module.css';

const errorImg = require('../../assets/robots.png');

function ErrorPage() {
  const error = useRouteError();
  let errorMessage: string;
  let errorStatus: string | number = 'Unknown';

  // inspired from keipala's response in this forum at SO
  // https://stackoverflow.com/questions/75944820/whats-the-correct-type-for-error-in-userouteerror-from-react-router-dom
  // Need to do this because error thrown can be of any kind
  // ie Router-Dom Error, custom Error from any loader, etc

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    if (error.status === 404) {
      errorMessage = "We couldn't find what you're looking for."
    } else {
      errorMessage = error.statusText;
    }

    errorStatus = String(error.status);
  } else if (error instanceof AxiosError) {
    console.log(error);
    errorStatus = error.response?.status || 'Unknown';
    errorMessage = error.response?.data.error || error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    console.error(error);
    errorMessage = 'Unknown error';
  }

  const errorContent = (
    <main className={styles.error}>
      <h1>Oops! A {errorStatus} error occurred...</h1>
      <p className="mt-3">{errorMessage}</p>
      <p className={styles.p}>
        Don't worry. Our team of robot experts will get to the bottom of this.
      </p>
      <p className={styles.p}>Just kidding - we will!</p>
    </main>
  );

  return (
    <Container fluid>
      <Row>
        <Col className={`${styles.column} ${styles.sticky}`} sm="auto">
          <MainNav />
        </Col>
        <Col className={`${styles.column} ${styles.errorColumn}`}>
          <Row className={styles.imgContainer}>
            <Image className={styles.errorImg} src={errorImg} rounded fluid></Image>
          </Row>
          <Row>{errorContent}</Row>
        </Col>
      </Row>
    </Container>
  );
}

export default ErrorPage;
