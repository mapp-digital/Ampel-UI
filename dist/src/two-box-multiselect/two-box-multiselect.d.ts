import * as React from 'react';
import { Option } from '../api/index';
interface Props<T> {
    id: string;
    values: Array<T>;
    options: Array<Option<T>>;
    onChange: (values: Array<T>) => void;
    labelLeft: string;
    labelRight: string;
    filterPlaceholderLeft?: string;
    filterPlaceholderRight?: string;
}
interface State<T> {
    leftFilter: string;
    rightFilter: string;
    leftHighlighted: Array<T>;
    rightHighlighted: Array<T>;
}
declare class TwoBoxMultiselect<T> extends React.Component<Props<T>, State<T>> {
    constructor(props: Props<T>);
    render(): JSX.Element;
    private changeFilter;
    private renderControlPanel;
    private getControlButton;
    private renderOptions;
    private getFilterPlaceholder;
    private renderOptionForSide;
    private handleDoubleClick;
    private removeHighlighted;
    private removeAll;
    private resetRightHighlighted;
    private addAll;
    private addHighlighted;
    private resetLeftHighlighted;
    private addValues;
    private removeValues;
    private isSelected;
    private isNotSelected;
    private renderLeftBox;
    private renderRightBox;
    private toggleHighlighted;
    private createUpdate;
    private isHighlighted;
    private addHighlight;
    private removeHighlight;
    private getHighlightedCollection;
}
export { TwoBoxMultiselect };
