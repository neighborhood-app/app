import { Outlet } from "react-router";
import styles from "./RootLayout.module.css";
import { Link } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <a href="#" className={styles.link}>
            <strong>HOME</strong>
          </a>
        </div>
        <div className={styles.navRight}>
          <a href="#" className={styles.link}>
            <strong>PROFILE</strong>
          </a>
          <Link to="/logout" className={styles.link}>
            <strong>SIGN OUT</strong>
          </Link>
        </div>
      </nav>
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
