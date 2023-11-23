import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCompass, faHouse } from '@fortawesome/free-solid-svg-icons';
import styles from './MainNav.module.css';

const profilePic = require('./profile_placeholder.png');

const MainNav = () => {
  const mql = window.matchMedia('(max-width: 576px)');

  const [smallDisplay, setSmallDisplay] = useState(mql.matches);

  mql.addEventListener('change', () => {
    setSmallDisplay(mql.matches);
  });

  const profileIconLink = (
    <div className={styles.link}>
      <img className={styles.profilePicture} src={profilePic} alt="User's profile" />
    </div>
  );

  const homeIconLink = (
    <div className={styles.link}>
      <FontAwesomeIcon
        className={`${styles.navIcon} ${styles.homeIcon}`}
        icon={faHouse}
        size="xl"></FontAwesomeIcon>
    </div>
  );

  const exploreIconLink = (
    <Link to={'/explore'}>
      <div className={styles.link}>
        <FontAwesomeIcon
          className={`${styles.compassIcon} ${styles.navIcon}`}
          icon={faCompass}></FontAwesomeIcon>
      </div>
    </Link>
  );

  const notificationsIconLink = (
    <div className={styles.link}>
      <FontAwesomeIcon
        icon={faBell}
        className={`${styles.navIcon} ${styles.bellIcon}`}></FontAwesomeIcon>
    </div>
  );

  return (
    <Navbar className={styles.nav} expand="sm">
      {smallDisplay ? (
        <>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link href="#features" className={styles.navbarCollapseLink}>
                MY PROFILE
              </Nav.Link>
              <Nav.Link href="#pricing" className={styles.navbarCollapseLink}>
                HOME
              </Nav.Link>
              <Nav.Link href="/explore" className={styles.navbarCollapseLink}>
                EXPLORE
              </Nav.Link>
              <Nav.Link href="#pricing" className={styles.navbarCollapseLink}>
                NOTIFICATIONS
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </>
      ) : (
        <>
          {profileIconLink}
          {homeIconLink}
          {exploreIconLink}
          {notificationsIconLink}
        </>
      )}
    </Navbar>
  );
};

export default MainNav;
