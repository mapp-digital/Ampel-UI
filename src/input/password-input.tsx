import { isFunction, isNil } from 'lodash';
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
    enablePasswordToggle?: boolean;
    onPasswordToggle?: (value: boolean) => void;
}

interface State {
    value: string;
    passwordVisible: boolean;
}

class PasswordInput extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const value = isNil(props.value) ? '' : props.value;
        this.state = {
            value,
            passwordVisible: Boolean(props.passwordVisible),
        };
        this.onChange = this.onChange.bind(this);
        this.onPasswordToggle = this.onPasswordToggle.bind(this);
    }

    public render() {
        return (
            <div
                className={`password-input-component input-component ${
                    this.props.enablePasswordToggle ? 'password-toggle-visible' : ''
                }`}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
            >
                {this.props.prepend && (
                    <span className="input-prepend" data-qa="input--prepend">
                        {this.props.prepend}
                    </span>
                )}
                <input
                    id={this.props.id}
                    type={this.state.passwordVisible ? 'text' : 'password'}
                    value={this.state.value}
                    onBlur={this.props.onBlur}
                    onChange={this.onChange}
                    data-qa={`password-input--component-${this.props.id}`}
                    className={`form-control ${this.props.className || ''}`}
                    placeholder={this.props.placeholder}
                    disabled={this.props.disabled}
                    autoFocus={this.props.autoFocus}
                />
                {this.props.enablePasswordToggle && (
                    <button
                        type="button"
                        disabled={this.props.disabled}
                        className={`password-toggle btn btn-secondary ${this.state.passwordVisible ? 'show' : 'hide'}`}
                        onClick={this.onPasswordToggle}
                        data-qa={`password--toggle`}
                    />
                )}
                {this.props.append && (
                    <span className="input-append" data-qa="input--append">
                        {this.props.append}
                    </span>
                )}
            </div>
        );
    }

    private onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        this.setState({ value });
        this.props.onChange(value);
    }

    private onPasswordToggle(event: React.MouseEvent<HTMLButtonElement>) {
        const passwordVisible = !this.state.passwordVisible;
        this.setState({ passwordVisible });

        if (isFunction(this.props.onPasswordToggle)) {
            this.props.onPasswordToggle(passwordVisible);
        }
    }
}

export { PasswordInput };
