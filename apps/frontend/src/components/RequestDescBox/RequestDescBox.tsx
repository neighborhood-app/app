// import { useParams } from 'react-router';
// import CustomBtn from '../CustomBtn/CustomBtn';
// import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';
import { Link } from 'react-router-dom';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './RequestDescBox.module.css';
import { FullRequestData } from '../../types';

const requestImg = require('../../assets/help_wanted.jpeg');

interface Props {
  request: FullRequestData;
}

export default function RequestDescBox({ request }: Props) {
  const { user, neighborhood } = request;
  const requestDate = request.time_created.split('T')[0];
  let userName = '';

  if (user.first_name && user.last_name) userName = `${user.first_name} ${user.last_name}`;
  else userName = user.username;

  return (
    <Container className="m-sm-3 mt-4" fluid>
      <Row className='mb-2 mt-sm-4'>
        <Link to={`/neighborhoods/${neighborhood.id}`}>
          <FontAwesomeIcon className={styles.backIcon} icon={faAngleLeft} />
          <h5 className={styles.neighborhoodTitle}>{neighborhood.name}</h5>
        </Link>
      </Row>
      <Row>
        <Col sm="3">
          <Image fluid className={styles.requestImg} rounded src={requestImg} alt="Request" />
          <p className={`${styles.requestDate} small`}>Created at {requestDate}</p>
        </Col>
        <Col className='me-sm-2'>
          <h3>{request.title}</h3>
          <Link to="#">
            <Image fluid className={styles.userIcon} roundedCircle src={requestImg} alt="Request" />
            <p className={`${styles.userName} text-muted`}>{userName}</p>
          </Link>
          <p>{request.content}</p>
        </Col>
      </Row>
    </Container>
  );
}
