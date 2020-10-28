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
    passwordVisible?: boolean;
    passwordToggleVisible?: boolean;
    onPasswordToggle?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const PasswordInput: React.FunctionComponent<Props> = (props) => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value);
    // React assumes inputs with null/undefined value are uncontrolled and will throw warnings when changing the value.
    const value = props.value !== undefined || props.value !== null ? props.value : '';
    return (
        <div
            className={`password-input-component ${props.passwordToggleVisible ? 'password-toggle-visible' : ''}`}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        >
            {props.prepend && (
                <span className="input-prepend" data-qa="input--prepend">
                    {props.prepend}
                </span>
            )}
            <input
                id={props.id}
                type={props.passwordVisible ? 'text' : 'password'}
                value={value}
                onBlur={props.onBlur}
                onChange={onChange}
                data-qa={`password-input--component-${props.id}`}
                className={`form-control ${props.className || ''}`}
                placeholder={props.placeholder}
                disabled={props.disabled}
                autoFocus={props.autoFocus}
            />
            {props.passwordToggleVisible && (
                <span
                    className={`password-toggle ${props.passwordVisible ? 'hide' : 'show'}`}
                    role="button"
                    onClick={props.onPasswordToggle}
                    data-qa={`password--toggle`}
                />
            )}
            {props.append && (
                <span className="input-append" data-qa="input--append">
                    {props.append}
                </span>
            )}
        </div>
    );
};

export { PasswordInput };
