import * as React from 'react';

import { Notification, NotificationItem } from './';

interface Notifications {
    show: (notification: NotificationItem) => void;
}

interface NotificationsContext {
    notifications: Notifications;
}

interface State {
    notifications: Array<NotificationItem>;
}

const NotificationContext = React.createContext<Notifications | null>(null);

class NotificationsProvider extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            notifications: [],
        };

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    public show(notification: NotificationItem) {
        const notificationWithId = { ...notification, id: Date.now().toString() };
        this.setState((prevState) => ({
            notifications: [...prevState.notifications, notificationWithId],
        }));
    }

    public hide(notification: NotificationItem) {
        this.setState((prevState) => ({
            notifications: prevState.notifications.filter(
                (currentNotification) => notification.id !== currentNotification.id
            ),
        }));
    }

    public render() {
        return (
            <NotificationContext.Provider
                value={{
                    show: this.show,
                }}
            >
                <div className="notification-wrapper" data-qa="notification-wrapper">
                    {this.state.notifications.map((notification) => {
                        const onCloseHandler = () => this.hide(notification);
                        return (
                            <Notification
                                id={notification.id as string}
                                type={notification.type}
                                message={notification.message}
                                onClose={onCloseHandler}
                                key={notification.id}
                            />
                        );
                    })}
                </div>
                {this.props.children}
            </NotificationContext.Provider>
        );
    }
}

const NotificationsConsumer = NotificationContext.Consumer;

const withNotifications = <P extends object>(Component: React.ComponentType<P>) => (props: P) => (
    <NotificationsConsumer>{(context) => <Component notifications={context} {...props} />}</NotificationsConsumer>
);

export { NotificationsConsumer, NotificationsProvider, withNotifications, Notifications, NotificationsContext };
