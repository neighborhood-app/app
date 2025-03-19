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
import neighborhoodServices from '../../services/neighborhoods';
import notificationServices from '../../services/notifications';
import { getStoredUser } from '../../utils/auth';

export default function Notifications({
  className,
  position,
}: {
  className: string;
  position?: IPopoverNotificationCenterProps['position'];
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
          await neighborhoodServices
            .connectUserToNeighborhood(Number(userId), Number(neighborhoodId))
            .then(_ => {
              notificationServices.joinReqAccepted(Number(userId), Number(neighborhoodId)).catch(console.error);
            });
        } catch (error) {
          if (error instanceof AxiosError) {
            // TODO: display error in some manner
            console.error(error);
          }
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
      <PopoverNotificationCenter
        colorScheme={'light'}
        onNotificationClick={handleOnNotificationClick}
        onActionClick={handleOnActionClick}
        position={position}>
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    );
  };

  const styles = {
    bellButton: {
      root: {
        svg: {
          color: 'white',
          fill: 'white',
          minWidth: '32px',
          minHeight: '32px',
          '&:hover': { fill: '#ff2b00', color: '#ff2b00' },
          '&:active': { fill: '#e92700', color: '#e92700' },
        },
      },
      dot: {
        rect: {
          fill: '#ff2a70', // '#45f400', #00e909
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
      },
    },
    notifications: {
      listItem: {
        buttons: {
          primary: {
            borderRadius: '0.375rem',
            background: '#fe496f',
            '&:hover': {
              background: '#ff0054',
            },
          },
          secondary: {
            background: 'transparent',
            border: '1px solid #212529',
            color: '#212529',
            '&:hover': {
              background: '#ff2b00',
              color: 'white',
              border: 0,
            },
          },
        },
      },
    },
  };


  return (
    <div className={className} title="Notifications">
      <NovuProvider
        subscriberHash={user?.hashedSubscriberId}
        subscriberId={String(user?.id)}
        applicationIdentifier={process.env.REACT_APP_NOVU_APP_ID || ''}
        styles={styles}>
        <CustomNotificationCenter></CustomNotificationCenter>
      </NovuProvider>
    </div>
  );
}
