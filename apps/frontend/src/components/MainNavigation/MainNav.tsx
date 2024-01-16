import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav, Navbar } from 'react-bootstrap';
import { faBell, faCompass, faHouse, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  IMessage,
  MessageActionStatusEnum,
  useMarkNotificationsAs,
} from '@novu/notification-center';

import { AxiosError } from 'axios';
import styles from './MainNav.module.css';
import { getStoredUser, deleteStoredUser } from '../../utils/auth';
import neighborhoodServices from '../../services/neighborhoods';
import notificationServices from '../../services/notifications';
import UserCircle from '../UserCircle/UserCircle';

// const profilePic = require('./profile_placeholder.png');

const MainNav = () => {
  const mql = window.matchMedia('(max-width: 576px)');
  const user = getStoredUser();
  const { markNotificationsAs } = useMarkNotificationsAs({
    onSuccess: () => {
      console.log('Notification marked as read');
    },
    onError: (error) => {
      console.error('Error marking notification as read', error);
    },
  });

  const [smallDisplay, setSmallDisplay] = useState(mql.matches);

  mql.addEventListener('change', () => {
    setSmallDisplay(mql.matches);
  });

  const Notification = () => {
    const handleOnNotificationClick = (message: IMessage) => {
      if (message.cta?.data.url) {
        window.location.href = message.cta.data.url;
      }
    };

    const handleOnActionClick = async (temp: string, btnType: string, notification: IMessage) => {
      if (temp === 'join-neighborhood' && btnType === 'primary') {
        const { userId, neighborhoodId } = notification.payload;
        try {
          const res = await neighborhoodServices.connectUserToNeighborhood(
            Number(userId),
            Number(neighborhoodId),
          );

          if ('success' in res) notification.content = res.success;
        } catch (error) {
          if (error instanceof AxiosError) {
            notification.content = error.response?.data.error;
          }
          console.log(error);
        } finally {
          // eslint-disable-next-line no-underscore-dangle
          markNotificationsAs({ messageId: notification._id, read: true, seen: true });

          await notificationServices.updateAction(
            // eslint-disable-next-line no-underscore-dangle
            notification._id,
            btnType,
            MessageActionStatusEnum.DONE,
          );
        }
      }
    };

    return (
      <NovuProvider
        initialFetchingStrategy={{ fetchNotifications: true }}
        subscriberHash={user?.hashedSubscriberId}
        subscriberId={String(user?.id)}
        applicationIdentifier={'bPm7zbb5KQz7'}>
        <PopoverNotificationCenter
          colorScheme={'light'}
          onNotificationClick={handleOnNotificationClick}
          onActionClick={handleOnActionClick}>
          {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
        </PopoverNotificationCenter>
      </NovuProvider>
    );
  };

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

  const notificationsIconLink = (
    <div className={styles.link} title="Notifications">
      <FontAwesomeIcon
        icon={faBell}
        className={`${styles.navIcon} ${styles.bellIcon}`}></FontAwesomeIcon>
    </div>
  );

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
      <Notification></Notification>
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
