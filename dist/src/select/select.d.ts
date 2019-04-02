import * as React from 'react';
import { Option } from '../api/index';
interface Props<T> {
    id: string;
    value?: T;
    options: Array<Option<T>>;
    onChange: (value: T) => void;
    className?: string;
    placeholder?: string;
}
interface State {
    expanded: boolean;
}
declare class Select<T> extends React.Component<Props<T>, State> {
    private node;
    constructor(props: Props<T>);
    componentWillMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private getOptionsList;
    private getLabel;
    private setNode;
    private onKeyPressed;
    private handleGlobalClick;
    private collapseOptionsList;
    private handleOptionClick;
    private toggleOptionsList;
    private isSelected;
}
declare const StringSelect: new () => Select<string>;
declare const NumberSelect: new () => Select<number>;
export { Select, StringSelect, NumberSelect };
