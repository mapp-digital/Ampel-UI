import * as React from 'react';

const FALLBACK_ID = 'default';

enum MessageBoxSeverity {
    INFO = 'info',
}

interface Props {
    id?: string;
    message: string | React.ReactNode;
    severity: MessageBoxSeverity;
    headline?: string | React.ReactNode;
}

class MessageBox extends React.Component<Props, {}> {
    public render() {
        const id = this.props.id || FALLBACK_ID;
        return (
            <div className={`message-box ${this.props.severity}`} data-qa={`message-box-${id}`}>
                <div className="message-box-content" data-qa={`message-box--content-${id}`}>
                    <div className="icon-wrapper" data-qa="message-box--icon-wrapper">
                        <div className="icon-background" />
                        <div className="icon" />
                    </div>
                    <div className="message-wrapper">
                        {this.props.headline && (
                            <div className="message-box-headline" data-qa="message-box--headline">
                                {this.props.headline}
                            </div>
                        )}
                        <div className="message-box-message" data-qa="message-box--message">
                            {this.props.message}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { MessageBox, MessageBoxSeverity };
