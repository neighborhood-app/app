import { Outlet } from "react-router";
import styles from "./RootLayout.module.css";
import { Link } from "react-router-dom";
import { UserContext } from "../../utils/contexts";
import { getStoredUser } from "../../utils/auth";

const RootLayout = () => {
  const user = getStoredUser();

  return (
    //@ts-ignore
    <UserContext.Provider value={{ user }}>
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
    </UserContext.Provider>
  );
};

export default RootLayout;
