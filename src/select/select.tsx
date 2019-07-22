import { isEqual } from 'lodash';

import * as React from 'react';

import { Option } from '../api/index';
import { matches } from '../common/search';
import { onOuterClick } from '../subscriptions';

interface Props<T> {
    id: string;
    value?: T;
    options: Array<Option<T>>;
    onChange: (value: T) => void;
    disabled?: boolean;
    className?: string;
    searchable?: boolean;
    placeholder?: string;
    disableOptionWhen?: (value: T) => boolean;
    searchPlaceholder?: string;
}

interface State<T> {
    expanded: boolean;
    options: Array<Option<T>>;
}

const KEY_ESCAPE = 27;

class Select<T> extends React.Component<Props<T>, State<T>> {
    private node: any;
    private dispose: () => void;
    private readonly searchInputRef: React.RefObject<HTMLInputElement>;

    constructor(props: Props<T>) {
        super(props);

        this.state = {
            expanded: false,
            options: this.props.options,
        };

        this.searchInputRef = React.createRef();

        this.setNode = this.setNode.bind(this);
        this.onKeyPressed = this.onKeyPressed.bind(this);
        this.filterOptions = this.filterOptions.bind(this);
        this.isOptionDisabled = this.isOptionDisabled.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.toggleOptionsList = this.toggleOptionsList.bind(this);
        this.collapseOptionsList = this.collapseOptionsList.bind(this);
        this.toggleOptionsIfNotDisabled = this.toggleOptionsIfNotDisabled.bind(this);
    }

    public componentDidMount() {
        this.dispose = onOuterClick(this.node, this.collapseOptionsList);
    }

    public componentWillUnmount() {
        this.dispose();
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
                    onClick={this.toggleOptionsIfNotDisabled}
                    data-qa={`select--toggle-${this.props.id}`}
                    className={`select-option-toggle ${this.props.disabled ? 'disabled' : ''}`}
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
            <div className="select-options-wrapper">
                {this.getFilter()}
                <ul className="select-option-items" data-qa={`select--option-items-${this.props.id}`}>
                    {this.state.options.map((option, index) => {
                        const selectedClass = this.isSelected(option) ? ' selected' : '';
                        const disabledClass = this.isOptionDisabled(option.value) ? ' disabled' : '';
                        return (
                            <li
                                key={index}
                                role="option"
                                onClick={this.handleOptionClick.bind(this, option.value)}
                                data-qa={`select--option-${option.label}`}
                                className={`item${selectedClass}${disabledClass}`}
                                aria-selected={this.isSelected(option)}
                            >
                                {option.label}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    private getFilter() {
        return (
            this.props.searchable && (
                <div className="select-filter-bar">
                    <input
                        type="text"
                        data-qa={`select--filter-${this.props.id}`}
                        className="form-control"
                        placeholder={this.props.searchPlaceholder || 'search'}
                        onChange={this.filterOptions}
                        ref={this.searchInputRef}
                    />
                    <span className="select-filter-icon" />
                </div>
            )
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

    private collapseOptionsList() {
        if (this.state.expanded) {
            this.toggleOptionsList();
        }
    }

    private handleOptionClick(value: T) {
        this.toggleOptionsList();
        const isOptionEnabled = !this.isOptionDisabled(value);
        const valueChanged = value !== this.props.value;
        if (isOptionEnabled && valueChanged) {
            this.props.onChange(value);
        }
    }

    private isOptionDisabled(value: T) {
        return this.props.disableOptionWhen && this.props.disableOptionWhen(value);
    }

    private toggleOptionsIfNotDisabled() {
        if (!this.props.disabled) {
            this.toggleOptionsList();
        }
    }

    private toggleOptionsList() {
        this.setState(
            (prevState) => {
                return {
                    expanded: !prevState.expanded,
                    options: this.props.options,
                };
            },
            () => {
                this.focusSearchInput();
            }
        );
    }

    private focusSearchInput() {
        if (this.props.searchable && this.searchInputRef.current) {
            this.searchInputRef.current.focus();
        }
    }

    private isSelected(option: Option<T>) {
        return isEqual(this.props.value, option.value);
    }

    private filterOptions(event: React.ChangeEvent<HTMLInputElement>) {
        const filteredOptions = this.props.options.filter((option) => matches(event.target.value, option.label));
        this.setState({
            options: filteredOptions,
        });
    }
}

const StringSelect = Select as new () => Select<string>;
const NumberSelect = Select as new () => Select<number>;

export { Select, StringSelect, NumberSelect };
