import * as React from 'react';
interface Props {
    id: string;
    title: string;
    content: string | React.ReactNode;
    btnCancelText: string;
    btnConfirmText: string;
    onCancel: () => void;
    onConfirm: () => void;
}
declare class Dialog extends React.Component<Props, {}> {
    private dialog;
    constructor(props: Props);
    componentDidMount(): void;
    render(): JSX.Element;
    private onKeyupHandler;
    private focus;
}
export { Dialog };
