import * as React from 'react';
import { Option } from '../api/index';
import { MarksWithOptions } from './marks-with-options';
interface Props<T> {
    id: string;
    value: T;
    options: Array<Option<T>>;
    onChange: (value: T) => void;
}
interface State<T> {
    currentValue: number;
    marksWithOptions: MarksWithOptions<T>;
}
declare class OptionsSlider<T> extends React.Component<Props<T>, State<T>> {
    constructor(props: Props<T>);
    render(): JSX.Element;
    private createMarksWithLabelComponents;
    private onLabelClick;
    private onChange;
    private onAfterChange;
}
export { OptionsSlider };
