import LoginForm from "../../components/LoginForm/LoginForm";
import styles from './login.module.css'
import loginService from "../../services/login";
import { LoginData } from "../../types";
import { redirect } from "react-router";

//@ts-ignore
export async function action({ request }) {
  const formData = await request.formData();
  const loginData = Object.fromEntries(formData) as LoginData;
  const response = await loginService.login(loginData);
  
  if (response) return redirect('/');
}

export default function Login() {
  return (
    <main className={styles.main}>
      <LoginForm />
    </main>
  )
}