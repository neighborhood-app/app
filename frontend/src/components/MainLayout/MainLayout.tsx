import { Outlet } from "react-router";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <a className={styles.link}>Home</a>
        </div>
        <div className={styles.navRight}>
          <a className={styles.link}>Profile</a>
          <a className={styles.link}>Sign out</a>
        </div>
      </nav>
        <Outlet />
      <footer className={styles.footer}>
        <p>Placeholder</p>
      </footer>
    </main>
  )
}