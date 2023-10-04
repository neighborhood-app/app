import styles from './LoginForm.module.css'
import { Form, Container, Col, Row } from 'react-bootstrap';
import { Form as FormRouter, Link, useNavigate } from 'react-router-dom';
import CustomBtn from '../CustomBtn/CustomBtn';

export default function LoginForm({ className }: {className: string}) {
  const navigate = useNavigate();
  const redirectToSignUp = () => navigate('/signup');

    return (
      <Col lg={6} className={className}>
        <FormRouter method='post' role='form' className={styles.loginForm}>
          <h2>Log In</h2>
          <Form.Group className={`mb-3`} controlId='username'>
            <Form.Label column='sm'>Username</Form.Label>
            <Form.Control type='text' name='username' placeholder='Your username' required />
          </Form.Group>
          <Form.Group className='mb-3' controlId='password'>
            <Form.Label column='sm'>Password</Form.Label>
            <Form.Control type='password' name='password' placeholder='Password' required />
          </Form.Group>
          <Form.Group className='mb-3 input-group-sm' controlId='formBasicCheckbox'>
            <Container>
              <Row>
                <Col className={styles.checkboxCol}>
                  <Form.Check type='checkbox' label='Remember me' />
                </Col>
                <Col sm={7} className={styles.forgotPwdCol}>
                  <Link to={'#'}>Forgot your password?</Link>
                </Col>
              </Row>
            </Container>
          </Form.Group>
          <div className='d-grid gap-2'>
            <CustomBtn variant='primary' type='submit'>Submit</CustomBtn>
            <CustomBtn variant='outline-dark' onClick={redirectToSignUp}>Don't have an account? Sign up!</CustomBtn>
          </div>
        </FormRouter>
      </Col>
    );
}