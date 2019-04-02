import * as React from 'react';
declare enum NotificationTypes {
    SUCCESS = "success",
    ERROR = "error",
    INFO = "info"
}
interface NotificationItem {
    id?: string;
    type: NotificationTypes;
    message: string | React.ReactNode;
}
interface Props {
    id: string;
    type: NotificationTypes;
    message: string | React.ReactNode;
    onClose: () => void;
}
declare class Notification extends React.Component<Props, {}> {
    private timer;
    private icons;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private setTimer;
    private clearTimer;
}
export { Notification, NotificationTypes, NotificationItem };
