import styles from './SignUpForm.module.css'
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import { Form as FormRouter, Link } from 'react-router-dom';

export default function SignUpForm({ className }: {className: string}) {
    return (
      <Col lg={6} className={className}>
        <FormRouter method='post' role='form' className={styles.loginForm}>
          <h2>Log In</h2>
          <Form.Group className={`mb-3`} controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='text' name='username' placeholder='Your username' required />
          </Form.Group>
          <Form.Group className='mb-3' controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' name='password' placeholder='Password' required />
          </Form.Group>
          <div className='d-grid gap-2'>
            <Button className={styles.mainBtn} variant='primary' type='submit'>
              Submit
            </Button>
          </div>
        </FormRouter>
      </Col>
    );
}