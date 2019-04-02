import * as React from 'react';
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
declare const DialogContext: React.Context<DialogContextProps | null>;
declare class DialogProvider extends React.Component<{}, State> {
    constructor(props: {});
    render(): JSX.Element;
    private onDialogConfirm;
    private onDialogCancel;
    private open;
    private close;
}
declare const DialogConsumer: React.ExoticComponent<React.ConsumerProps<DialogContextProps | null>>;
declare const withDialog: <P extends object>(Component: React.ComponentType<P>) => (props: P) => JSX.Element;
export { DialogContextProps, DialogConsumer, DialogContext, DialogModel, DialogProvider, withDialog };
