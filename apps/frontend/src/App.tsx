import { Outlet } from "react-router";
import styles from "./App.module.css";

export default function App() {
  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <a href="#" className={styles.link}><strong>HOME</strong></a>
        </div>
        <div className={styles.navRight}>
          <a href="#" className={styles.link}><strong>PROFILE</strong></a>
          <a href="#" className={styles.link}><strong>SIGN OUT</strong></a>
        </div>
      </nav>
      <main className={styles.main}>
        <Outlet/>
      </main>
      <footer className={styles.footer}>
        <p className={styles.paragraph}><strong>PLACEHOLDER</strong></p>
      </footer>
    </>
  )
}