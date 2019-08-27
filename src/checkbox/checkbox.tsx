import * as React from 'react';

interface Props {
    id: string;
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
    className?: string;
    label?: string;
}

const Checkbox: React.FunctionComponent<Props> = (props) => {
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(event.target.checked);
    };
    // TODO: Upgrade to useCallback (React API Hooks)
    return (
        <>
            <input
                id={props.id}
                type="checkbox"
                checked={props.value}
                data-qa={`checkbox-${props.id}`}
                onChange={changeHandler}
                disabled={props.disabled}
                className={`checkbox ${props.className}`}
                aria-checked={props.value}
            />
            <label htmlFor={props.id}>{props.label || ''}</label>
        </>
    );
};

export { Checkbox };
