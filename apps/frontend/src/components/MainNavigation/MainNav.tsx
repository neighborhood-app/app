import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav, Navbar } from 'react-bootstrap';
import { faCompass, faHouse, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import styles from './MainNav.module.css';
import { getStoredUser, deleteStoredUser } from '../../utils/auth';
import UserCircle from '../UserCircle/UserCircle';
import Notifications from '../Notifications/Notifications';

// const profilePic = require('./profile_placeholder.png');

const MainNav = () => {
  const mql = window.matchMedia('(max-width: 576px)');
  const user = getStoredUser();

  const [smallDisplay, setSmallDisplay] = useState(mql.matches);

  mql.addEventListener('change', () => {
    setSmallDisplay(mql.matches);
  });

  const profileIconLink = user ? (
    <Link to={`/users/${user.id}`}>
      <div className={styles.link}>
        {/* <img className={styles.profilePicture} src={profilePic} alt="User's profile" /> */}
        <UserCircle username={user.username} isLast={true} inStack={false} />
      </div>
    </Link>
  ) : null;

  const homeIconLink = (
    <Link to={'/'} title="Home">
      <div className={styles.link}>
        <FontAwesomeIcon
          className={`${styles.navIcon} ${styles.homeIcon}`}
          icon={faHouse}
          size="xl"></FontAwesomeIcon>
      </div>
    <Link to={'/'} title="Home">
      <div className={styles.link}>
        <FontAwesomeIcon
          className={`${styles.navIcon} ${styles.homeIcon}`}
          icon={faHouse}
          size="xl"></FontAwesomeIcon>
      </div>
    </Link>
  );

  const exploreIconLink = (
    <Link to={'/explore'} title="Explore neighborhoods">
    <Link to={'/explore'} title="Explore neighborhoods">
      <div className={styles.link}>
        <FontAwesomeIcon
          className={`${styles.compassIcon} ${styles.navIcon}`}
          icon={faCompass}></FontAwesomeIcon>
      </div>
    </Link>
  );

  const notificationsIconLink = <Notifications className={styles.link}></Notifications>;

  const logoutIconLink = (
    <div className={styles.link} title="Log out">
    <div className={styles.link} title="Log out">
      <FontAwesomeIcon
        icon={faRightFromBracket}
        className={`${styles.navIcon} ${styles.logOutIcon}`}
        onClick={() => {
          deleteStoredUser();
          window.location.reload();
        }}
      />
    </div>
  );

  return (
    <>
      <Navbar className={styles.nav} expand="sm">
        {smallDisplay ? (
          <>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav className="me-auto">
                {user ? (
                  <Nav.Link href={`/users/${user.id}`} className={styles.navbarCollapseLink}>
                    MY PROFILE
                  </Nav.Link>
                ) : null}
                <Nav.Link href="/" className={styles.navbarCollapseLink}>
                  HOME
                </Nav.Link>
                <Nav.Link href="/explore" className={styles.navbarCollapseLink}>
                  EXPLORE
                </Nav.Link>
                <Nav.Link href="#pricing" className={styles.navbarCollapseLink}>
                  NOTIFICATIONS
                </Nav.Link>
                <Nav.Link
                  className={styles.navbarCollapseLink}
                  onClick={() => {
                    deleteStoredUser();
                    window.location.reload();
                  }}>
                  SIGN OUT
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
            {logoutIconLink}
          </>
        )}
      </Navbar>
    </>
  );
};

export default MainNav;
