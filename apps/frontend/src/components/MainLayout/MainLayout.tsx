import { Outlet } from "react-router";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <a href="#" className={styles.link}>Home</a>
        </div>
        <div className={styles.navRight}>
          <a href="#" className={styles.link}>Profile</a>
          <a href="#" className={styles.link}>Sign out</a>
        </div>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p className={styles.paragraph}>Placeholder</p>
      </footer>
    </>
  )
}