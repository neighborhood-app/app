import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import styles from './MainNav.module.css';

const profilePic = require('./profile_placeholder.png');

const MainNav = () => {
  const mql = window.matchMedia('(max-width: 576px)');

  const [smallDisplay, setSmallDisplay] = useState(mql.matches);

  mql.addEventListener('change', () => {
    setSmallDisplay(mql.matches);
  });

  const compass = document.querySelector('.compass');

  compass?.addEventListener('click', (_) => {
    console.log('in listener');

    compass.setAttribute('spin', '');
  });

  const profileIconLink = (
    <div className={styles.link}>
      <img className={styles.profilePicture} src={profilePic} alt="User's profile" />
    </div>
  );

  const homeIconLink = (
    <div className={styles.link}>
      <svg className={styles.homeLink} viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7zm-9 .7c0-1.1.9-2 2-2s2 .9 2 2h-4z"></path>
      </svg>
    </div>
  );

  const exploreIconLink = (
    <Link to={'/explore'}>
      <div className={styles.link}>
        <FontAwesomeIcon className={`${styles.compass} ${styles.navIcon}`} icon={faCompass}></FontAwesomeIcon>
      </div>
    </Link>
  );

  const notificationsIconLink = (
    <div className={styles.link}>
      <svg className={styles.notificationsLink} viewBox="0 0 448 512">
        <path d="M256 32V51.2C329 66.03 384 130.6 384 208V226.8C384 273.9 401.3 319.2 432.5 354.4L439.9 362.7C448.3 372.2 450.4 385.6 445.2 397.1C440 408.6 428.6 416 416 416H32C19.4 416 7.971 408.6 2.809 397.1C-2.353 385.6-.2883 372.2 8.084 362.7L15.5 354.4C46.74 319.2 64 273.9 64 226.8V208C64 130.6 118.1 66.03 192 51.2V32C192 14.33 206.3 0 224 0C241.7 0 256 14.33 256 32H256zM224 512C207 512 190.7 505.3 178.7 493.3C166.7 481.3 160 464.1 160 448H288C288 464.1 281.3 481.3 269.3 493.3C257.3 505.3 240.1 512 224 512z" />
      </svg>
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
