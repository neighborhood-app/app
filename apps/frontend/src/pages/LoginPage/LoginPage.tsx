import LoginForm from "../../components/LoginForm/LoginForm";
import styles from "./LoginPage.module.css";
import login from "../../services/login";
import { LoginData, UserInfo } from "../../types";
import { redirect } from "react-router";

export async function action({ request }: { request: Request }) {
  console.log('in the action');
  
  const formData = await request.formData();
  const loginData = Object.fromEntries(formData) as unknown as LoginData;
  const user: UserInfo = await login(loginData);

  console.log({ loginData, user });

  if (user) {
    window.localStorage.setItem("user", JSON.stringify(user));
    return redirect("/");
  }
}

export default function LoginPage() {
  return (
    <div className={styles.loginContainer}>
      <LoginForm />
    </div>
  );
}
