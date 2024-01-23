import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  IMessage,
  MessageActionStatusEnum,
  useUpdateAction,
  ButtonTypeEnum,
} from '@novu/notification-center';
import { AxiosError } from 'axios';
import neighborhoodServices from '../../services/neighborhoods';
import { getStoredUser } from '../../utils/auth';

export default function Notifications({ className }: { className: string }) {
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
      <PopoverNotificationCenter
        colorScheme={'light'}
        onNotificationClick={handleOnNotificationClick}
        onActionClick={handleOnActionClick}>
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    );
  };

  const styles = {
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
  };

  return (
    <div className={className} title="Notifications">
      <NovuProvider
        subscriberHash={user?.hashedSubscriberId}
        subscriberId={String(user?.id)}
        // TODO: move to .env file
        applicationIdentifier={'bPm7zbb5KQz7'}
        styles={styles}>
        <CustomNotificationCenter></CustomNotificationCenter>
      </NovuProvider>
    </div>
  );
}
