import SignUpForm from "../../components/SignUpForm/SignUpForm";
import WelcomeImgBox from "../../components/WelcomeImgBox/WelcomeImgBox";
import { Container, Row } from 'react-bootstrap';
import styles from "./SignUpPage.module.css";
import { SignUpData } from "../../types";
import signUp from "../../services/signUp";

export async function action({ request }: { request: Request }) {  
  const formData = await request.formData();
  const signUpData = Object.fromEntries(formData) as unknown as SignUpData;

  await signUp(signUpData);

  return null;
}

export default function SignUpPage() {
  return (
    <Container className={styles.wrapperContainer} fluid>
    <h1 className={styles.neighborhoodHeading}>Neighborhood</h1>
    <Row className={styles.customRow}>
      <WelcomeImgBox className={`${styles.customCol} ${styles.imgCol}`}></WelcomeImgBox>
      <SignUpForm className={`${styles.customCol} ${styles.formWrapper}`}></SignUpForm>
    </Row>
  </Container>
  );
}
