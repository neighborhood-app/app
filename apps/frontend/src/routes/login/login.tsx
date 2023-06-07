import LoginForm from "../../components/LoginForm/LoginForm";
import styles from './login.module.css'
import login from "../../services/login";
import { LoginData } from "../../types";
import { redirect } from "react-router";

export async function action({ request }: {request: Request}) {
  const formData = await request.formData();
  const loginData = Object.fromEntries(formData) as unknown as LoginData;
  // add type to user
  const user = await login(loginData);
  console.log('login frontend route');
  console.log({ user });
  
  // bug here: truthiness of user not enough as it might be error response
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