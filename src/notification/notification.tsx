import * as React from 'react';

enum NotificationTypes {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
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

class Notification extends React.Component<Props, {}> {
    private timer: any;
    private icons = {
        success: 'wti-check',
        error: 'wti-error',
        info: 'wti-info',
    };

    constructor(props: Props) {
        super(props);

        this.setTimer = this.setTimer.bind(this);
        this.clearTimer = this.clearTimer.bind(this);
    }

    public componentDidMount() {
        this.setTimer();
    }

    public componentWillUnmount() {
        this.clearTimer();
    }

    public render() {
        const { id, type, message, onClose } = this.props;
        return (
            <div
                id={id}
                className={`notification notification-${type}`}
                onClick={onClose}
                onMouseEnter={this.clearTimer}
                onMouseLeave={this.setTimer}
                role="alert"
                data-qa={`notification-${type}`}
            >
                <div className="notification-icon">
                    <span className={`wt-icon ${this.icons[type]}`} />
                </div>
                <div className="notification-message">{message}</div>
                <div className="notification-action">
                    <span className="wt-icon wti-close" />
                </div>
            </div>
        );
    }

    private setTimer() {
        if (this.props.type !== NotificationTypes.ERROR) {
            this.timer = setTimeout(this.props.onClose, 5000);
        }
    }

    private clearTimer() {
        if (this.props.type !== NotificationTypes.ERROR) {
            clearTimeout(this.timer);
        }
    }
}

export { Notification, NotificationTypes, NotificationItem };
