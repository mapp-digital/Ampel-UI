import * as React from 'react';
declare enum TriStateCheckboxState {
    CHECKED = 0,
    UNCHECKED = 1,
    INDETERMINATE = 2
}
interface Props {
    id: string;
    value: TriStateCheckboxState;
    onChange: (value: boolean) => void;
    disabled?: boolean;
    className?: string;
}
declare const TriStateCheckbox: React.FunctionComponent<Props>;
export { TriStateCheckbox, TriStateCheckboxState };
