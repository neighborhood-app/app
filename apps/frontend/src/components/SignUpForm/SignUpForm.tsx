import { Form, Col } from 'react-bootstrap';
import { Form as FormRouter, useNavigate } from 'react-router-dom';
import CustomBtn from '../CustomBtn/CustomBtn';
import styles from './SignUpForm.module.css';

export default function SignUpForm({ className }: { className: string }) {
  const navigate = useNavigate();
  const redirectToLogin = () => navigate('/login');

  return (
    <Col lg={6} className={className}>
      <FormRouter method="post" role="form" className={styles.signUpForm}>
        <h2>Sign Up</h2>
        <Form.Group className={`mb-2`} controlId="email">
          <Form.Label column="sm">
            Email<span className={styles.asterisk}>*</span>
          </Form.Label>
          <Form.Control type="text" name="email" placeholder="name@example.com" required />
        </Form.Group>
        <Form.Group className={`mb-2`} controlId="firstName">
          <Form.Label column="sm">First name</Form.Label>
          <Form.Control type="text" name="firstName" placeholder="Your name" />
        </Form.Group>
        <Form.Group className={`mb-2`} controlId="lastName">
          <Form.Label column="sm">Last name</Form.Label>
          <Form.Control type="text" name="lastName" placeholder="Your last name" />
        </Form.Group>
        <Form.Group className={`mb-2`} controlId="username">
          <Form.Label column="sm">
            Username<span className={styles.asterisk}>*</span>
          </Form.Label>
          <Form.Control type="text" name="username" placeholder="Your username" required />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label column="sm">
            Password<span className={styles.asterisk}>*</span>
          </Form.Label>
          <Form.Control type="password" name="password" placeholder="Password" required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Text className="text-muted">
            Fields marked with <span className={styles.asterisk}>*</span> are required.
          </Form.Text>
        </Form.Group>
        <div className="d-grid gap-2">
          <CustomBtn variant="primary" type="submit">
            Submit
          </CustomBtn>
          <CustomBtn variant="outline-dark" onClick={redirectToLogin}>
            Already have an account?
            <br /> Log in!
          </CustomBtn>
        </div>
      </FormRouter>
    </Col>
  );
}
