import styles from './LoginForm.module.css'

export default function LoginForm() {
    return (
        <div className={styles.formContainer}>
            <div className={styles.logoContainer}>
                <h2>NEIGHBORHOOD</h2>
            </div>
            <form className={styles.form}>
                <label className={styles.label} htmlFor='username'>USERNAME:</label>
                <input className={styles.input} type='text' name='username' id='username'></input>

                <label className={styles.label} htmlFor='password'>PASSWORD:</label>
                <input className={styles.input} type='password' name='password' id='password'></input>

                <input className={styles.submit} type='submit' value='LOGIN'></input>
            </form>
        </div>
    )
}