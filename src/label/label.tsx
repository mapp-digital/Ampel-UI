import * as React from 'react';

interface Props {
    for: string;
    value: any;
    append?: string;
    className?: string;
}

const Label: React.FunctionComponent<Props> = (props) => {
    return (
        <label data-qa={`label--for-${props.for}`} htmlFor={props.for} className={`label ${props.className || ''}`}>{`${
            props.value
        }${props.append || ''}`}</label>
    );
};

export { Label };
