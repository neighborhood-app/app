import styles from './LoginForm.module.css'
import { Form } from 'react-router-dom';

export default function LoginForm() {
    return (
        <div className={styles.formContainer}>
            <div className={styles.logoContainer}>
                <h2>NEIGHBORHOOD</h2>
            </div>
            <Form method="post" className={styles.form} name='login-form'>
                <label className={styles.label} htmlFor='username'>USERNAME:</label>
                <input className={styles.input} type='text' name='username' id='username' required></input>

                <label className={styles.label} htmlFor='password'>PASSWORD:</label>
                <input className={styles.input} type='password' name='password' id='password' required></input>

                <input className={styles.submit} type='submit' value='LOGIN'></input>
            </Form>
        </div>
    )
}