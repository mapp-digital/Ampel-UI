import { isEqual } from 'lodash';

import * as React from 'react';

import { Option } from '../api/index';

interface Props<T> {
    id: string;
    value?: T;
    options: Array<Option<T>>;
    onChange: (value: T) => void;
    className?: string;
    placeholder?: string;
}

interface State {
    expanded: boolean;
}

const KEY_ESCAPE = 27;

class Select<T> extends React.Component<Props<T>, State> {
    private node: any;
    constructor(props: Props<T>) {
        super(props);

        this.state = {
            expanded: false,
        };

        this.setNode = this.setNode.bind(this);
        this.onKeyPressed = this.onKeyPressed.bind(this);
        this.handleGlobalClick = this.handleGlobalClick.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.toggleOptionsList = this.toggleOptionsList.bind(this);
        this.collapseOptionsList = this.collapseOptionsList.bind(this);
    }

    public componentWillMount() {
        document.addEventListener('mousedown', this.handleGlobalClick, false);
    }

    public componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleGlobalClick, false);
    }

    public render() {
        const label = this.getLabel();
        return (
            <div
                ref={this.setNode}
                role="button"
                tabIndex={-1}
                onKeyDown={this.onKeyPressed}
                className="select-component"
            >
                <a
                    role="button"
                    onClick={this.toggleOptionsList}
                    data-qa={`select--toggle-${this.props.id}`}
                    className="select-option-toggle"
                    aria-haspopup="listbox"
                >
                    <span className="text" data-qa={`select--toggle-text-${this.props.id}`}>
                        {label}
                    </span>
                    <span className="arrow" />
                </a>
                {this.state.expanded && this.getOptionsList()}
            </div>
        );
    }

    private getOptionsList() {
        return (
            <ul className="select-option-items" data-qa={`select--option-items-${this.props.id}`}>
                {this.props.options.map((option, index) => {
                    const selectedClass = this.isSelected(option) ? 'selected ' : '';
                    return (
                        <li
                            key={index}
                            role="option"
                            onClick={this.handleOptionClick.bind(this, option.value)}
                            data-qa={`select--option-${option.label}`}
                            className={`item ${selectedClass}`}
                            aria-selected={this.isSelected(option)}
                        >
                            {option.label}
                        </li>
                    );
                })}
            </ul>
        );
    }

    private getLabel() {
        const selectedOption = this.props.options.find((option) => isEqual(option.value, this.props.value));
        return (selectedOption && selectedOption.label) || this.props.placeholder;
    }

    private setNode(node: any) {
        this.node = node;
    }

    private onKeyPressed(event: React.KeyboardEvent) {
        if (event.keyCode === KEY_ESCAPE) {
            this.collapseOptionsList();
        }
    }

    private handleGlobalClick(event: MouseEvent) {
        if (!this.node.contains(event.target)) {
            this.collapseOptionsList();
        }
    }

    private collapseOptionsList() {
        if (this.state.expanded) {
            this.toggleOptionsList();
        }
    }

    private handleOptionClick(value: T) {
        this.toggleOptionsList();
        if (value !== this.props.value) {
            this.props.onChange(value);
        }
    }

    private toggleOptionsList() {
        this.setState((prevState) => {
            return { expanded: !prevState.expanded };
        });
    }

    private isSelected(option: Option<T>) {
        return isEqual(this.props.value, option.value);
    }
}

const StringSelect = Select as new () => Select<string>;
const NumberSelect = Select as new () => Select<number>;

export { Select, StringSelect, NumberSelect };
