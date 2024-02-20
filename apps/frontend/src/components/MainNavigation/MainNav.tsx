import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav, Navbar } from 'react-bootstrap';
import { faCompass, faHouse, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { IPopoverNotificationCenterProps } from '@novu/notification-center';
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
    </Link>
  );

  const exploreIconLink = (
    <Link to={'/explore'} title="Explore neighborhoods">
      <div className={styles.link}>
        <FontAwesomeIcon
          className={`${styles.compassIcon} ${styles.navIcon}`}
          icon={faCompass}></FontAwesomeIcon>
      </div>
    </Link>
  );

  const NotificationBell = (
    position?: IPopoverNotificationCenterProps['position'],
  ) => <Notifications className={styles.link} position={position}></Notifications>;

  const logoutIconLink = (
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
      <Navbar className={styles.nav} variant='' expand="sm">
        {smallDisplay ? (
          <>
            {NotificationBell('bottom-start')}
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav className="me-auto">
                {user ? (
                  <Nav.Link href={`/users/${user.id}`} className={styles.navbarCollapseLink}>
                    My Profile
                  </Nav.Link>
                ) : null}
                <Nav.Link href="/" className={styles.navbarCollapseLink}>
                  Home
                </Nav.Link>
                <Nav.Link href="/explore" className={styles.navbarCollapseLink}>
                  Explore
                </Nav.Link>
                <Nav.Link
                  className={styles.navbarCollapseLink}
                  onClick={() => {
                    deleteStoredUser();
                    window.location.reload();
                  }}>
                  Sign Out
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        ) : (
          <>
            {profileIconLink}
            {homeIconLink}
            {exploreIconLink}
            {NotificationBell('right-start')}
            {logoutIconLink}
          </>
        )}
      </Navbar>
    </>
  );
};

export default MainNav;
