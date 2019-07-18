import * as React from 'react';

interface Props {
    id: string;
    value: boolean;
    disabled?: boolean;
    description?: string;
    onChange: (newValue: boolean) => void;
    /** @deprecated */
    onLabel?: string;
    offLabel?: string;
}

const Toggle: React.FunctionComponent<Props> = (props) => {
    const toggleHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
        !props.disabled && props.onChange(event.target.checked);
    return (
        <div className="toggle-wrapper">
            <input
                type="checkbox"
                className="toggle"
                data-qa={`toggle-${props.id}`}
                onChange={toggleHandler}
                aria-checked={props.value}
                checked={props.value}
                disabled={props.disabled}
            />
            {props.description ? <label data-qa={`toggle-${props.id}--description`}>{props.description}</label> : null}
        </div>
    );
};

export { Toggle };
