import styles from './LoginForm.module.css'
import React, { ChangeEvent, useState } from 'react'
import loginService from '../services/login';
import { AxiosError } from 'axios';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleUserNameInput(event: ChangeEvent) {
        const element = event.target as HTMLInputElement;
        setUsername(element.value);
    }

    function handlePasswordInput(event: ChangeEvent) {
        const element = event.target as HTMLInputElement;
        setPassword(element.value);
    }

    async function handleLogin(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        try {
            const user = await loginService.login(username, password);
            window.localStorage.setItem('loggedNeighborhoodUser', JSON.stringify(user));
            setUsername('');
            setPassword('');
        } catch(error) {
            // To be replaced with a proper error notifiaction
            if (error instanceof AxiosError && error.response) console.log(error.response.data.error);
        }
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.logoContainer}>
                <h2>NEIGHBORHOOD</h2>
            </div>
            <form onSubmit={handleLogin} className={styles.form} name='login-form'>
                <label className={styles.label} htmlFor='username'>USERNAME:</label>
                <input className={styles.input} type='text' name='username' id='username' value={username} onChange={handleUserNameInput}></input>

                <label className={styles.label} htmlFor='password'>PASSWORD:</label>
                <input className={styles.input} type='password' name='password' id='password' value={password} onChange={handlePasswordInput}></input>

                <input className={styles.submit} type='submit' value='LOGIN'></input>
            </form>
        </div>
    )
}