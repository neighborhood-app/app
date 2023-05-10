import LoginForm from "../components/LoginForm";
import styles from './login.module.css'

export default function Login() {
  return (
    <main className={styles.main}>
      <LoginForm />
    </main>
  )
}