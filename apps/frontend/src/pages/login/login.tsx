import LoginForm from "./components/LoginForm/LoginForm";
import styles from './login.module.css'
import login from "../../services/login";
import { LoginData, UserInfo } from "../../types";
import { redirect } from "react-router";

export async function action({ request }: {request: Request}) {
  const formData = await request.formData();
  const loginData = Object.fromEntries(formData) as unknown as LoginData;
  const user: UserInfo = await login(loginData);
  
  if (user) {
    window.localStorage.setItem('user', JSON.stringify(user));
    return redirect('/');
  }
}

export default function Login() {
  return (
    <div className={styles.loginContainer}>
      <LoginForm />
    </div>  
  )
}