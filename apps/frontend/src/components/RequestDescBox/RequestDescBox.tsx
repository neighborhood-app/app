// import { useParams } from 'react-router';
// import CustomBtn from '../CustomBtn/CustomBtn';
// import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';
import { Link } from 'react-router-dom';
import { Container, Image, Row } from 'react-bootstrap';
import type { FullRequestData } from '../../services/requests';
import styles from './RequestDescBox.module.css';

const requestImg = require('../../assets/help_wanted.jpeg');

interface Props {
  request: FullRequestData;
}

export default function RequestDescBox({ request }: Props) {
  const { user, neighborhood } = request;

  return (
    <Container fluid>
      <Row>
        <Link to={`/neighborhoods/${neighborhood.id}`}>
          <h5 className={styles.neighborhoodTitle}>{neighborhood.name}</h5>
        </Link>
      </Row>
      <Row>
        <Image fluid className={styles.requestImg} roundedCircle src={requestImg} alt="Request" />
        <h1>{request.title}</h1>
        <p>{request.content}</p>
        <p>{user.username}</p>
      </Row>
    </Container>
  );
}
