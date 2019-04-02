import * as React from 'react';
import { NotificationItem } from './';
interface Notifications {
    show: (notification: NotificationItem) => void;
}
interface NotificationsContext {
    notifications: Notifications;
}
interface State {
    notifications: Array<NotificationItem>;
}
declare class NotificationsProvider extends React.Component<{}, State> {
    constructor(props: {});
    show(notification: NotificationItem): void;
    hide(notification: NotificationItem): void;
    render(): JSX.Element;
}
declare const NotificationsConsumer: React.ExoticComponent<React.ConsumerProps<Notifications | null>>;
declare const withNotifications: <P extends object>(Component: React.ComponentType<P>) => (props: P) => JSX.Element;
export { NotificationsConsumer, NotificationsProvider, withNotifications, Notifications, NotificationsContext };
