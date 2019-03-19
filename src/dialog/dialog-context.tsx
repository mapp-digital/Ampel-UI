import * as React from 'react';

import { Dialog as DialogComponent } from './dialog';

interface DialogModel {
    id: string;
    title: string;
    content: string | React.ReactNode;
    btnCancelText: string;
    btnConfirmText: string;
    onCancel?: () => void;
    onConfirm: () => void;
}

interface DialogContextProps {
    open: (dialog: DialogModel) => void;
}

interface DialogContext {
    dialog: DialogContextProps;
}

interface State {
    dialog?: DialogModel;
}

const DialogContext = React.createContext<DialogContextProps | null>(null);

class DialogProvider extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {};

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onDialogCancel = this.onDialogCancel.bind(this);
        this.onDialogConfirm = this.onDialogConfirm.bind(this);
    }

    public render() {
        return (
            <DialogContext.Provider
                value={{
                    open: this.open,
                }}
            >
                {this.state.dialog && (
                    <DialogComponent
                        {...this.state.dialog}
                        onCancel={this.onDialogCancel}
                        onConfirm={this.onDialogConfirm}
                    />
                )}
                {this.props.children}
            </DialogContext.Provider>
        );
    }

    private onDialogConfirm() {
        if (this.state.dialog) {
            this.state.dialog.onConfirm();
        }
        this.close();
    }

    private onDialogCancel() {
        if (this.state.dialog && this.state.dialog.onCancel) {
            this.state.dialog.onCancel();
        }
        this.close();
    }

    private open(dialog: DialogModel) {
        this.setState({
            dialog,
        });
    }

    private close() {
        this.setState({
            dialog: undefined,
        });
    }
}

const DialogConsumer = DialogContext.Consumer;

const withDialog = <P extends object>(Component: React.ComponentType<P>) => (props: P) => (
    <DialogConsumer>{(context) => <Component dialog={context} {...props} />}</DialogConsumer>
);

export { DialogContextProps, DialogConsumer, DialogContext, DialogModel, DialogProvider, withDialog };
