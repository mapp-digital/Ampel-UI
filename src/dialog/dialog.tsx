import * as React from 'react';

import { Button } from '@ampel-ui/button';

const KEY_ESCAPE = 27;

interface Props {
    id: string;
    title: string;
    content: string | React.ReactNode;
    btnCancelText: string;
    btnConfirmText: string;
    onCancel: () => void;
    onConfirm: () => void;
}

class Dialog extends React.Component<Props, {}> {
    private dialog = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);

        this.onKeyupHandler = this.onKeyupHandler.bind(this);
        this.focus = this.focus.bind(this);
    }

    public componentDidMount() {
        this.focus();
    }

    public render() {
        return (
            <div
                id={this.props.id}
                className="dialog"
                ref={this.dialog}
                onKeyUp={this.onKeyupHandler}
                tabIndex={-1}
                role="dialog"
                data-qa={`dialog-${this.props.id}`}
            >
                <div className="dialog-content">
                    <div className="dialog-content-header">
                        <h3 className="dialog-title">{this.props.title}</h3>
                    </div>
                    <div className="dialog-content-body">{this.props.content}</div>
                    <div className="dialog-content-footer">
                        <Button
                            id="cancel"
                            text={this.props.btnCancelText}
                            className="btn btn-secondary"
                            onClick={this.props.onCancel}
                        />
                        <Button
                            id="success"
                            text={this.props.btnConfirmText}
                            className="btn btn-primary"
                            onClick={this.props.onConfirm}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private onKeyupHandler(event: React.KeyboardEvent) {
        if (event.keyCode === KEY_ESCAPE) {
            this.props.onCancel();
        }
    }

    private focus() {
        this.dialog.current!.focus();
    }
}

export { Dialog };
