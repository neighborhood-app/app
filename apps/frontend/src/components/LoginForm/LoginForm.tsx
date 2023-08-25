import styles from './LoginForm.module.css'
import { Form, Button, Container, Col, Row, Image } from 'react-bootstrap';
import { Form as FormRouter } from 'react-router-dom';

export default function LoginForm() {
    return (
      <>
      <h1>Neighborhood</h1>
      <Container fluid>
        <Row>
        <Col>
          <Container>
          <Image className={styles.neighborhoodImg} src={require('../../assets/neighborhood2.jpeg')} rounded fluid></Image>
          <h2>Welcome!</h2>
          <p>Connect with your neigbors. Share resources. Build a strong community.</p>
          </Container>
        </Col>
        <Col>
          <Container>
            <h2>Log In</h2>
            <FormRouter method='post'>
              <Form.Group className='mb-3' controlId='username'>
                <Form.Label>Username</Form.Label>
                <Form.Control type='text' name='username' placeholder='Your username' required />
              </Form.Group>
              <Form.Group className='mb-3' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' name='password' placeholder='Password' required />
              </Form.Group>
              <Form.Group className='mb-3' controlId='formBasicCheckbox'>
                <Form.Check type='checkbox' label='Remember me' />
              </Form.Group>
              <div className='d-grid gap-2'>
                <Button className={styles.mainBtn} variant='primary' type='submit'>
                  Submit
                </Button>
                <Button variant='outline-dark' type='button' href='#'>
                  Don't have an account? Sign up!
                </Button>
              </div>
            </FormRouter>
          </Container>
        </Col>
        </Row>
      </Container>
      </>
    )
}