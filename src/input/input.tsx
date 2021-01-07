import * as React from 'react';

interface Props {
    id: string;
    value: any;
    onBlur?: (event: React.FormEvent<HTMLInputElement>) => void;
    append?: string;
    prepend?: string;
    onChange: (value: any) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
    autoFocus?: boolean;
    disableAutoComplete?: boolean;
}

const Input: React.FunctionComponent<Props> = (props) => {
    // TODO: should make usage of `useCallback` ASAP.
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value);
    // React assumes inputs with null/undefined value are uncontrolled and will throw warnings when changing the value.
    const value = props.value !== undefined || props.value !== null ? props.value : '';
    return (
        <div className="input-component" onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
            {props.prepend && (
                <span className="input-prepend" data-qa="input--prepend">
                    {props.prepend}
                </span>
            )}
            <input
                id={props.id}
                type="text"
                value={value}
                onBlur={props.onBlur}
                onChange={onChange}
                data-qa={`input--element-${props.id}`}
                className={`form-control ${props.className || ''}`}
                placeholder={props.placeholder}
                disabled={props.disabled}
                autoFocus={props.autoFocus}
                autoComplete={props.disableAutoComplete ? 'off' : 'on'}
            />
            {props.append && (
                <span className="input-append" data-qa="input--append">
                    {props.append}
                </span>
            )}
        </div>
    );
};

export { Input };
