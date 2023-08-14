import styles from "./MainNav.module.css";
import { Link } from "react-router-dom";

const MainNav = () => {
  return (
    <header>
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
    </header>
  );
};

export default MainNav;
