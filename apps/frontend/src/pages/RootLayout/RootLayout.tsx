import { Outlet } from "react-router";
import styles from "./RootLayout.module.css";

import MainNav from "../../components/MainNavigation/MainNav";
// import Footer from "../../components/Footer/Footer";

const RootLayout = () => {
  return (
    <>
      <MainNav />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
