import { Form } from 'react-bootstrap';
import CustomBtn from '../CustomBtn/CustomBtn';
import styles from './DescriptionBox.module.css';
import { User } from '@prisma/client';
import { useParams, useSubmit } from 'react-router-dom';
import { FormEvent } from 'react';

interface Props {
  showJoinBtn: boolean,
  showEditBtn: boolean,
  showLeaveBtn: boolean,
  name: string,
  description: string,
  users?: Array<User> | null
}

export default function DescriptionBox({showJoinBtn, showEditBtn, showLeaveBtn, name, description, users}: Props) {
  const submit = useSubmit();
  const { id: neighborhoodId } = useParams();

  const handleJoin = (event: FormEvent<HTMLFormElement>) => {    
    event.preventDefault();

    submit(event.currentTarget, {
      method: 'post',
      action: `/neighborhoods/${neighborhoodId}`,
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img className={styles.neighborhoodImg} src={require('./palm.jpeg')} alt='Neighborhood'/>
        <h1 className={styles.neighborhoodTitle}>{name}</h1>
        {showJoinBtn ? 
        // Create separate component
        <Form method='post' onSubmit={handleJoin}>
          <Form.Group>
            <Form.Control type='hidden' name='intent' value='join-neighborhood' />
          </Form.Group>
          <CustomBtn variant='primary' className={styles.button} type='submit'>
            Join Neighborhood
          </CustomBtn>
        </Form>
        : null}
      </div>
      <div className={styles.neighborhoodDescription}>
        <p>{description}</p>
        {users ? <p>{users.length} members</p> : null}
        {showEditBtn ? <CustomBtn variant='outline-dark' className={styles.editBtn}>Edit Neighborhood</CustomBtn> : null}
        {showLeaveBtn ? <CustomBtn variant='danger'>Leave Neighborhood</CustomBtn> : null}
      </div>
    </div>
  )
};

