import * as React from 'react';

import { Checkbox } from '../checkbox';

enum TriStateCheckboxState {
    CHECKED,
    UNCHECKED,
    INDETERMINATE,
}

interface Props {
    id: string;
    value: TriStateCheckboxState;
    onChange: (value: boolean) => void;
    disabled?: boolean;
    className?: string;
}

const TriStateCheckbox: React.FunctionComponent<Props> = (props) => {
    const value = props.value !== TriStateCheckboxState.UNCHECKED;
    const className = props.value === TriStateCheckboxState.INDETERMINATE ? 'indeterminate' : '';
    const onChange = () => props.onChange(props.value === TriStateCheckboxState.UNCHECKED);
    return <Checkbox id={props.id} className={className} value={value} onChange={onChange} />;
};

export { TriStateCheckbox, TriStateCheckboxState };
