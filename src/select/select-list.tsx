import * as React from 'react';

import { isEqual } from 'lodash';

import { Option } from '../api';

interface RendererProps<T, O> {
    value?: T;
    options: Array<O>;
    onChange: (value: T) => void;
    disableOptionWhen?: (value: T) => boolean;
}

interface Props<T, O extends Option<T>> {
    value?: T;
    options: Array<O>;
    onChange: (value: T) => void;
    disableOptionWhen?: (value: T) => boolean;
    renderer?: (props: RendererProps<T, O>) => React.ReactNode;
}

class SelectList<T, O extends Option<T>> extends React.Component<Props<T, O>, {}> {
    public render() {
        return (
            <div className="select-option-items">
                {this.props.renderer
                    ? this.props.renderer({
                          value: this.props.value,
                          options: this.props.options,
                          onChange: this.props.onChange,
                          disableOptionWhen: this.props.disableOptionWhen,
                      })
                    : this.renderDefaultList()}
            </div>
        );
    }

    private renderDefaultList() {
        return (
            <ul data-qa={`select-list--default`}>
                {this.props.options.map((option, index) => {
                    const selectedClass = this.isOptionSelected(option) ? ' selected' : '';
                    const disabledClass = this.isOptionDisabled(option.value) ? ' disabled' : '';
                    const onClick = () => {
                        if (!this.isOptionDisabled(option.value)) {
                            this.props.onChange(option.value);
                        }
                    };
                    return (
                        <li
                            key={index}
                            role="option"
                            onClick={onClick}
                            data-qa={`select--option-${option.label}`}
                            className={`item${selectedClass}${disabledClass}`}
                            aria-selected={this.isOptionSelected(option)}
                        >
                            {option.label}
                        </li>
                    );
                })}
            </ul>
        );
    }

    private isOptionSelected(option: O) {
        return isEqual(this.props.value, option.value);
    }

    private isOptionDisabled(value: T) {
        return this.props.disableOptionWhen && this.props.disableOptionWhen(value);
    }
}

export { SelectList, RendererProps };
