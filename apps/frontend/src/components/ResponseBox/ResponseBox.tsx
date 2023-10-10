import styles from './ResponseBox.module.css';
import { FormEvent } from 'react';
import { ResponseWithUserAndRequest } from "../../types"
import { useParams } from 'react-router';
import { useSubmit } from 'react-router-dom';
import { getStoredUser } from '../../utils/auth';
import CustomBtn from '../CustomBtn/CustomBtn';
import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';
import { Form } from 'react-bootstrap';

type Props = {
  response: ResponseWithUserAndRequest;
  requestOwnerId: number;
}

function isLoggedUserRequestOwner(userId: number, requestOwnerId: number) {
  return userId === requestOwnerId;
};

function isLoggedUserResponseOwner(userId: number, responseOwnerId: number) {
  return userId === responseOwnerId;
}

export default function ResponseBox({ response, requestOwnerId }: Props) {
  // const revalidator = useRevalidator();
  const submit = useSubmit();
  // const id = response.id;
  const { id: neighborhoodId } = useParams();

  let loggedUser = getStoredUser();
  let loggedUserId = loggedUser ? Number(loggedUser.id) : null;

  const date = String(response.time_created).split("T")[0];

  // function handleResponseAction(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault();

  //   submit(event.currentTarget, {
  //     method: 'post',
  //     action: `/neighborhoods/${neighborhoodId}`,
  //   });
  // }

  // function createActionButton(
  //   submitHandler: (event: FormEvent<HTMLFormElement>) => void, 
  //   intent: 'accept-offer' | 'delete-response', 
  //   text: string
  //   ) {
  //   return (
  //     <Form method='post' onSubmit={submitHandler}>
  //       <Form.Group>
  //         <Form.Control type='hidden' name='intent' value={intent} />
  //         <Form.Control type='hidden' name='responseId' value={id} />
  //       </Form.Group>
  //       <CustomBtn variant='primary' className={styles.btn} type='submit'>
  //         {text}
  //       </CustomBtn>
  //     </Form>
  //   )
  // }

  function displayContactInfo() {
    if (!(loggedUserId)) return;

    const requestOwner = isLoggedUserRequestOwner(loggedUserId, requestOwnerId);
    const responseOwner = isLoggedUserResponseOwner(loggedUserId, response.user_id); 

    if (!(requestOwner || responseOwner)) return null;

    if (requestOwner) {
      if (response.status === "ACCEPTED") {
        return (
          <>
            <p className={styles.p}>You've accepted this offer for help.</p>
            <p className={styles.p}>Contact at: <span>{response.user.email}</span></p>
          </>
        )
      } else {
        // return createActionButton(handleResponseAction, 'accept-offer', 'Accept Offer');
        return (
          <TriggerActionButton id={response.id} route={`/neighborhoods/${neighborhoodId}`} intent='accept-offer' text='Accept offer'/>
        )
      }
    } else if (responseOwner) {
      if (response.status === "ACCEPTED") {
        return (
          <>
            <p className={styles.p}>Your help offer has been accepted.</p>
            {/* {createActionButton(handleResponseAction, 'delete-response', 'Delete response')} */}
            <TriggerActionButton id={response.id} route={`/neighborhoods/${neighborhoodId}`} intent='delete-response' text='Delete response'/>
          </>
        )
      } else {
        return (
          <TriggerActionButton id={response.id} route={`/neighborhoods/${neighborhoodId}`} intent='delete-response' text='Delete response'/>
        )
      }
    }
  }
  const contactInfo = displayContactInfo();

  return (
    <div className={styles.responseCard}>
      <div className={styles.profileAndDate}>
        <div className={styles.profileInfo}>
          <img
            className={styles.profileImg}
            src={require('./images/profile.jpg')}
            alt="active user on neighborhood app" />
          <p className={styles.p}>{response.user.username}</p>
        </div>
        <p className={styles.createdDate}>{date}</p>
      </div>
      <p className={styles.p}>
        {response.content}
      </p>
      <hr className={styles.hr} />
      <div className={styles.contact}>
        {contactInfo}
      </div>
    </div>
  )
}