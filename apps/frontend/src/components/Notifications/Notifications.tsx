import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  IMessage,
  MessageActionStatusEnum,
  useUpdateAction,
  ButtonTypeEnum,
  IPopoverNotificationCenterProps,
} from '@novu/notification-center';
import { AxiosError } from 'axios';
import { Container } from 'react-bootstrap';
import neighborhoodServices from '../../services/neighborhoods';
import { getStoredUser } from '../../utils/auth';
import styles from './Notifications.module.css'

export default function Notifications({
  className,
  position,
}: {
  className: string;
  position?: IPopoverNotificationCenterProps["position"]
}) {
  const user = getStoredUser();

  const CustomNotificationCenter = () => {
    const { updateAction } = useUpdateAction();

    const handleOnNotificationClick = (message: IMessage) => {
      if (message.cta?.data.url) {
        window.location.href = message.cta.data.url;
      }
    };

    const handleOnActionClick = async (
      notificationType: string,
      btnType: ButtonTypeEnum,
      notification: IMessage,
    ) => {
      if (notificationType === 'join-neighborhood' && btnType === 'primary') {
        const { userId, neighborhoodId } = notification.payload;
        try {
          await neighborhoodServices.connectUserToNeighborhood(
            Number(userId),
            Number(neighborhoodId),
          );
        } catch (error) {
          if (error instanceof AxiosError) {
            // TODO: display error in some manner
          }
          console.log(error);
        }
      }

      updateAction({
        // eslint-disable-next-line no-underscore-dangle
        messageId: notification._id,
        actionButtonType: btnType,
        status: MessageActionStatusEnum.DONE,
      });
    };

    return (
      <Container className={styles.test}>
        <PopoverNotificationCenter
          colorScheme={'light'}
          onNotificationClick={handleOnNotificationClick}
          onActionClick={handleOnActionClick}
          position={position}>
          {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
        </PopoverNotificationCenter>
      </Container>
    );
  };

  const bellStyles = {
    bellButton: {
      root: {
        svg: {
          color: '#ff4e2a',
          fill: '#ff4e2a',
          minWidth: '32px',
          minHeight: '32px',
        },
      },
      dot: {
        rect: {
          fill: '#45f400', // or #f80000 or black
          strokeWidth: '0',
          width: '4px',
          height: '4px',
          x: 12,
          y: 1,
        },
      },
    },
    layout: {
      root: {
        width: '390px',
        maxWidth: '100vw',
        zIndex: '1700',
      }
    }
  };

  return (
    <div className={className} title="Notifications">
      <NovuProvider
        subscriberHash={user?.hashedSubscriberId}
        subscriberId={String(user?.id)}
        // TODO: move to .env file
        applicationIdentifier={'bPm7zbb5KQz7'}
        styles={bellStyles}>
        <CustomNotificationCenter></CustomNotificationCenter>
      </NovuProvider>
    </div>
  );
}
