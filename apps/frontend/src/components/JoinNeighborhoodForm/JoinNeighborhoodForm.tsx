import { FormEvent } from 'react';
import { Form } from 'react-bootstrap';
import { useParams, useSubmit } from 'react-router-dom';
import CustomBtn from '../CustomBtn/CustomBtn';
import styles from './JoinNeighborhoodForm.module.css';

export default function JoinNeighborhoodForm() {
  const submit = useSubmit();
  const { id: neighborhoodId } = useParams();

  const handleJoin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    submit(event.currentTarget, {
      method: 'post',
      action: `/neighborhoods/${neighborhoodId}`,
    });
  };

  return (
    <Form method="post" onSubmit={handleJoin}>
      <Form.Group>
        <Form.Control type="hidden" name="intent" value="join-neighborhood" />
      </Form.Group>
      <CustomBtn variant="primary" className={styles.button} type="submit">
        Join Neighborhood
      </CustomBtn>
    </Form>
  );
}
