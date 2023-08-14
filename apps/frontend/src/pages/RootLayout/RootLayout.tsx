import { Outlet } from "react-router";
import styles from "./RootLayout.module.css";
import { Link } from "react-router-dom";
import MainNav from "../../components/MainNavigation/MainNav";

const RootLayout = () => {
  return (
    <>
      <MainNav />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p className={styles.paragraph}>
          <strong>PLACEHOLDER</strong>
        </p>
      </footer>
    </>
  );
};

export default RootLayout;
