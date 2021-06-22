import * as React from 'react';

import { Button } from '@ampel-ui/button';
import { onOuterClick } from '@ampel-ui/subscriptions';

const KEY_ESCAPE = 27;

enum DialogType {
    info = 'info',
    success = 'success',
    warning = 'warning',
}

interface Props {
    id: string;
    title: string;
    type?: DialogType;
    content: string | React.ReactNode;
    btnCancelText?: string;
    btnConfirmText: string;
    onCancel: () => void;
    onConfirm: () => void;
}

class Dialog extends React.Component<Props, {}> {
    private dialog = React.createRef<HTMLDivElement>();
    private node: Node;
    private dispose: () => void;

    constructor(props: Props) {
        super(props);

        this.onKeyupHandler = this.onKeyupHandler.bind(this);
        this.setNode = this.setNode.bind(this);
        this.focus = this.focus.bind(this);
    }

    public componentDidMount() {
        this.focus();
        this.dispose = onOuterClick(this.node.firstChild as Node, this.props.onCancel);
    }

    public componentWillUnmount() {
        this.dispose();
    }

    public render() {
        return (
            <div ref={this.setNode}>
                <div
                    id={this.props.id}
                    className="dialog"
                    ref={this.dialog}
                    onKeyUp={this.onKeyupHandler}
                    tabIndex={-1}
                    role="dialog"
                    data-qa={`dialog`}
                >
                    <div className="dialog-content">
                        <button id="cancel" className={'cancel'} onClick={this.props.onCancel}>
                            <span className={`icon icon-close`} />
                        </button>
                        {this.props.type && (
                            <div className="dialog-content-icon-wrapper" data-qa={`type-${this.props.type}`}>
                                <span className={`icon icon-${this.props.type}`} />
                            </div>
                        )}
                        <div className="dialog-content-wrapper">
                            <div className="dialog-content-header">
                                <h3 className="dialog-title">{this.props.title}</h3>
                            </div>
                            <div className="dialog-content-body">{this.props.content}</div>
                            <div className="dialog-content-footer">
                                {this.props.btnCancelText && (
                                    <Button
                                        id="cancel"
                                        text={this.props.btnCancelText}
                                        className="btn btn-secondary"
                                        onClick={this.props.onCancel}
                                    />
                                )}
                                <Button
                                    id="success"
                                    text={this.props.btnConfirmText}
                                    className="btn btn-primary"
                                    onClick={this.props.onConfirm}
                                />
                            </div>
                        </div>
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

    private setNode(node: any) {
        this.node = node;
    }

    private focus() {
        this.dialog.current!.focus();
    }
}

export { Dialog, DialogType };
