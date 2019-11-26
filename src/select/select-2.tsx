import * as React from 'react';

import { matches } from '@ampel-ui/common/search';

import { isEqual } from 'lodash';

import { onOuterClick } from '@ampel-ui/subscriptions';

import { Option } from '../api/index';

import { RendererProps, SelectList } from './select-list';

interface Props<T, O extends Option<T>> {
    id: string;
    value: T;
    options: Array<O>;
    onChange: (value: T) => void;
    className?: string;
    searchable?: boolean;
    placeholder?: string;
    disabled?: boolean;
    disableOptionWhen?: (value: T) => boolean;
    optionsRenderer?: (props: RendererProps<T, O>) => JSX.Element;
}

interface State<T, O> {
    isExpanded: boolean;
    filterValue: string;
}

const KEY_ESCAPE = 27;

class Select2<T, O extends Option<T>> extends React.Component<Props<T, O>, State<T, O>> {
    private rootNode: HTMLDivElement;
    private dispose: () => void;
    private refHandlers = {
        rootNode: (ref: HTMLDivElement) => {
            this.rootNode = ref;
        },
    };

    constructor(props: Props<T, O>) {
        super(props);

        this.state = {
            filterValue: '',
            isExpanded: false,
        };

        this.clearSearch = this.clearSearch.bind(this);
        this.onKeyPressed = this.onKeyPressed.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.toggleOptionsList = this.toggleOptionsList.bind(this);
        this.expandOptionsList = this.expandOptionsList.bind(this);
        this.handleOptionSelect = this.handleOptionSelect.bind(this);
        this.collapseOptionsList = this.collapseOptionsList.bind(this);
        this.toggleOptionsIfNotDisabled = this.toggleOptionsIfNotDisabled.bind(this);
    }

    public componentDidMount() {
        this.dispose = onOuterClick(this.rootNode, this.collapseOptionsList);
    }

    public componentWillUnmount() {
        this.dispose();
    }

    public render() {
        return (
            <div
                ref={this.refHandlers.rootNode}
                role="button"
                tabIndex={-1}
                className={`select-component ${this.props.className || ''}`}
                data-qa={`select-component-${this.props.id}`}
                onKeyDown={this.onKeyPressed}
            >
                {this.props.searchable ? this.renderSearchableTrigger() : this.renderStandardTrigger()}
                {this.state.isExpanded && (
                    <div className="select-options-wrapper" data-qa={`select-options-wrapper-${this.props.id}`}>
                        <SelectList
                            options={this.getFilteredOptions()}
                            onChange={this.handleOptionSelect}
                            renderer={this.props.optionsRenderer}
                            value={this.props.value}
                        />
                    </div>
                )}
            </div>
        );
    }

    private getFilteredOptions() {
        return this.props.options.filter((option) => matches(this.state.filterValue, option.label));
    }

    private handleOptionSelect(value: T) {
        this.props.onChange(value);
        this.clearSearch();
        this.collapseOptionsList();
    }

    private toggleOptionsList() {
        this.setState((prevState) => ({
            isExpanded: !prevState.isExpanded,
        }));
    }

    private toggleOptionsIfNotDisabled() {
        if (!this.props.disabled) {
            this.toggleOptionsList();
        }
    }

    private collapseOptionsList() {
        this.setState({
            isExpanded: false,
        });
    }

    private expandOptionsList() {
        if (!this.props.disabled) {
            this.setState({
                isExpanded: true,
            });
        }
    }

    private onFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            filterValue: event.target.value,
        });
    }

    private onKeyPressed(event: React.KeyboardEvent) {
        if (event.keyCode === KEY_ESCAPE) {
            this.collapseOptionsList();
        }
    }

    private getLabel() {
        const selectedOption = this.props.options.find((option) => isEqual(option.value, this.props.value));
        return selectedOption && selectedOption.label;
    }

    private clearSearch() {
        this.setState({
            filterValue: '',
        });
    }

    private renderStandardTrigger() {
        const label = this.getLabel() || this.props.placeholder;
        return (
            <div
                role="button"
                data-qa={`select-toggle--standard-${this.props.id}`}
                className={`select-option-toggle ${this.props.disabled ? 'disabled' : ''}`}
                aria-haspopup="listbox"
                onClick={this.toggleOptionsIfNotDisabled}
            >
                <span className="text" data-qa={`select--toggle-text-${this.props.id}`}>
                    {label}
                </span>
                <span className="arrow" />
            </div>
        );
    }

    private renderSearchableTrigger() {
        return (
            <div
                role="button"
                data-qa={`select-toggle--search-${this.props.id}`}
                className={`select-option-toggle ${this.props.disabled ? 'disabled' : ''}`}
                aria-haspopup="listbox"
            >
                {this.getSearchInput()}
            </div>
        );
    }

    private getSearchInput() {
        return (
            <div className={`select-search-input`}>
                <span className="select-search-input--icon-filter" />
                <input
                    id={this.props.id}
                    type="text"
                    onChange={this.onFilterChange}
                    placeholder={this.getLabel() || this.props.placeholder}
                    onClick={this.expandOptionsList}
                    value={this.state.filterValue}
                />
                <button
                    type="button"
                    className="select-search-input--icon-clear"
                    onClick={this.clearSearch}
                    disabled={!this.state.filterValue.length}
                    data-qa={`select-search-input--icon-clear-${this.props.id}`}
                />
                <button
                    type="button"
                    className="select-search-input--icon-dropdown"
                    onClick={this.toggleOptionsIfNotDisabled}
                    data-qa={`select-search-input--icon-dropdown-${this.props.id}`}
                />
            </div>
        );
    }
}

export { Select2 };
