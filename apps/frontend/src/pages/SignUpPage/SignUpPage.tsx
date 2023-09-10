// import SignUpForm from "../../components/LoginForm/LoginForm";
import WelcomeImgBox from "../../components/WelcomeImgBox/WelcomeImgBox";
import { Container, Row } from 'react-bootstrap';
import styles from "./SignUpPage.module.css";
import { SignUpData, UserInfo } from "../../types";
import { redirect } from "react-router";
import signUp from "../../services/signUp";

export async function action({ request }: { request: Request }) {  
  const formData = await request.formData();
  // get the sign up data (what do we need?)
  // if valid data
    // create a new user
    // redirect to home page
  // otherwise
    // display error message (flash?)

  const signUpData = Object.fromEntries(formData) as unknown as SignUpData;
  const user: UserInfo = await signUp(signUpData);

  // if (user) {
  //   window.localStorage.setItem("user", JSON.stringify(user));
  //   return redirect("/");
  // }
}

export default function SignUpPage() {
  return (
    <Container className={styles.wrapperContainer} fluid>
    <h1 className={styles.neighborhoodHeading}>Neighborhood</h1>
    <Row className={styles.customRow}>
      <WelcomeImgBox className={`${styles.customCol} ${styles.imgCol}`}></WelcomeImgBox>
      {/* <LoginForm className={`${styles.customCol} ${styles.formWrapper}`}></LoginForm> */}
    </Row>
  </Container>
  );
}
