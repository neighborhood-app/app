import LoginForm from "../../components/LoginForm/LoginForm";
import WelcomeImgBox from "../../components/WelcomeImgBox/WelcomeImgBox";
import { Container, Row } from 'react-bootstrap';
import styles from "./LoginPage.module.css";
import login from "../../services/login";
import { LoginData, UserInfo } from "../../types";
import { redirect } from "react-router";

export async function action({ request }: { request: Request }) {  
  const formData = await request.formData();
  const loginData = Object.fromEntries(formData) as unknown as LoginData;
  const user: UserInfo = await login(loginData);

  if (user) {
    window.localStorage.setItem("user", JSON.stringify(user));
    return redirect("/");
  }
}

export default function LoginPage() {
  return (
    <Container className={styles.wrapperContainer} fluid>
    <h1>Neighborhood</h1>
    <Row className={styles.customRow}>
      <WelcomeImgBox className={`${styles.customCol} ${styles.imgCol}`}></WelcomeImgBox>
      <LoginForm className={`${styles.customCol} ${styles.formWrapper}`}></LoginForm>
    </Row>
  </Container>
  );
}
