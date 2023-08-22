import styles from './LoginForm.module.css'
import { Form, Button } from 'react-bootstrap';

export default function LoginForm() {
    return (
        <div className={styles.formContainer}>
          <div className={styles.logoContainer}>
            <h2>Log In</h2>
        </div>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Your username" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button className={styles.mainBtn} variant="primary" type="submit">
              Submit
            </Button>
            <Button variant="outline-dark" href='#'>
              Don't have an account? Sign up!
            </Button>
          </div>
        </Form>
            {/* <Form method="post" className={styles.form} name='login-form'>
                <label className={styles.label} htmlFor='username'>Username</label>
                <input className={styles.input} type='text' name='username' id='username' required></input>

                <label className={styles.label} htmlFor='password'>Password</label>
                <input className={styles.input} type='password' name='password' id='password' required></input>

                <input className={styles.submit} type='submit' value='LOGIN'></input> */}
            {/* </Form> */}
        </div>
    )
}