import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import MainNav from "../../components/MainNavigation/MainNav";
import styles from "./ErrorPage.module.css";

function ErrorPage() {
  const error = useRouteError();
  let errorMessage: string;
  let errorStatus: string = "Unknown";

  // inspired from keipala's response in this forum at SO
  // https://stackoverflow.com/questions/75944820/whats-the-correct-type-for-error-in-userouteerror-from-react-router-dom
  // Need to do this because error thrown can be of any kind
  // ie Router-Dom Error, custom Error from any loader, etc

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.statusText;
    errorStatus = String(error.status);
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  const errorContent = (
    <main className={styles.error}>
      <h1>Oops, An Error Occurred</h1>
      <p>{`${errorStatus}, ${errorMessage}`}</p>
    </main>
  );

  return (
    <>
      <MainNav />
      {errorContent}
    </>
  );
}

export default ErrorPage;
