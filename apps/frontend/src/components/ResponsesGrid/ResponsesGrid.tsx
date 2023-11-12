import { Col, Container, Row } from 'react-bootstrap';
import { ResponseWithUser } from '@neighborhood/backend/src/types';
import { RequestWithUserAndResponses } from '../../types';
import styles from './ResponsesGrid.module.css';
// import requestServices from '../../services/requests';
// import { getStoredUser } from '../../utils/auth';
import ResponseBox from '../ResponseBox/ResponseBox';

interface Props {
  request: RequestWithUserAndResponses;
}

export default function ResponsesGrid({ request }: Props) {
  // const [loading, setIsLoading] = useState(false);

  // const user = getStoredUser() as StoredUserData;
  // const { username, id: userId } = user;

  // const validateTextArea = () => validTextAreaPattern.test(responseInput);

  // const handleResponseSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const form = event.currentTarget;
  //   setFormSubmitted(true);

  //   if (!validateTextArea()) {
  //     event.stopPropagation();
  //   } else {
  //     submit(form, {
  //       method: 'post',
  //       action: `/neighborhoods/${neighborhoodId}`,
  //     });
  //     setShowForm(false);
  //     setFormSubmitted(false);
  //     setResponseInput('');
  //   }
  // };

  // const responseForm = (
  //   <Form
  //     className={styles.createResponseForm}
  //     role="form"
  //     onSubmit={handleResponseSubmit}
  //     noValidate>
  //     <Form.Group className="mb-2" controlId="content">
  //       <Form.Label column="sm">Write the details of your help offer:</Form.Label>
  //       <Form.Control
  //         as="textarea"
  //         rows={4}
  //         name="content"
  //         className="mb-3"
  //         minLength={4}
  //         required
  //         isInvalid={!validTextAreaPattern.test(responseInput) && formSubmitted}
  //         isValid={validTextAreaPattern.test(responseInput)}
  //         onChange={(event) => {
  //           setResponseInput(event.target.value);
  //           setFormSubmitted(false);
  //         }}
  //       />
  //       <Form.Control.Feedback type="invalid">
  //         The content needs to be at least 4 characters long.
  //       </Form.Control.Feedback>
  //     </Form.Group>
  //     <Form.Group>
  //       <Form.Control type="hidden" name="intent" value="create-response" />
  //       <Form.Control type="hidden" name="request_id" value={Number(request.id)} />
  //     </Form.Group>
  //     <Container className={styles.btnContainer} fluid>
  //       <Row className={`gx-3 gy-2 ${styles.responseBtnRow}`}>
  //         <Col sm="6" lg="3">
  //           <CustomBtn variant="primary" type="submit" className={styles.btn}>
  //             Submit
  //           </CustomBtn>
  //         </Col>
  //         <Col sm="6" lg="3">
  //           <CustomBtn
  //             variant="outline-dark"
  //             onClick={() => {
  //               setShowForm(false);
  //               setFormSubmitted(false);
  //             }}
  //             className={styles.btn}>
  //             Cancel
  //           </CustomBtn>
  //         </Col>
  //       </Row>
  //     </Container>
  //   </Form>
  // );

  const responseColumns =
    request.responses.map((response: ResponseWithUser) => (
      <Col className={`${styles.requestCol} pe-0`} sm="6" md="4" lg="3" key={request.id}>
        <ResponseBox response={response} requestOwnerId={request.user_id} key={request.id} />
      </Col>
    )) || [];

  const noResponsesText =
    request.status === 'OPEN'
      ? 'No one has responded yet. Be the first to help out!'
      : 'There are no responses to display.';

  return (
    <Container fluid>
      <Row className="mt-1 me-0 gy-sm-4 gx-xl-5 gx-sm-4 justify-content-start">
        {responseColumns.length !== 0 ? (
          responseColumns
        ) : (
          <p className={`${styles.noResponseText} mt-5`}>{noResponsesText}</p>
        )}
      </Row>
    </Container>
  );
}
