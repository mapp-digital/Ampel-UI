import * as React from 'react';

import { matches } from '@ampel-ui/common/search';

import { isEqual } from 'lodash';

import { onOuterClick } from '@ampel-ui/subscriptions';

import { Option } from '../api/index';

import { RendererProps, SelectList } from './select-list';

interface Props<T, O extends Option<T>> {
    id: string;
    value?: T;
    options: Array<O>;
    onChange: (value: T) => void;
    className?: string;
    searchable?: boolean;
    placeholder?: string;
    disabled?: boolean;
    disableOptionWhen?: (value: T) => boolean;
    optionsRenderer?: (props: RendererProps<T, O>) => React.ReactNode;
}

interface State {
    isExpanded: boolean;
    filterValue: string;
}

const KEY_ESCAPE = 27;

class Select<T, O extends Option<T> = Option<T>> extends React.Component<Props<T, O>, State> {
    private rootNode: HTMLDivElement;
    private dispose: () => void;

    constructor(props: Props<T, O>) {
        super(props);

        this.state = {
            filterValue: '',
            isExpanded: false,
        };

        this.setRootNode = this.setRootNode.bind(this);
        this.onKeyPressed = this.onKeyPressed.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.clearFilterValue = this.clearFilterValue.bind(this);
        this.toggleOptionsList = this.toggleOptionsList.bind(this);
        this.expandOptionsList = this.expandOptionsList.bind(this);
        this.handleOptionSelect = this.handleOptionSelect.bind(this);
        this.collapseOptionsList = this.collapseOptionsList.bind(this);
    }

    public componentDidMount() {
        this.dispose = onOuterClick(this.rootNode, this.collapseOptionsList);
    }

    public componentWillUnmount() {
        this.dispose();
    }

    public render() {
        const options = this.getFilteredOptions();
        return (
            <div
                ref={this.setRootNode}
                role="button"
                className={`select-component ${this.props.className || ''}`}
                data-qa={`select-component-${this.props.id}`}
                onKeyDown={this.onKeyPressed}
            >
                {this.props.searchable ? this.renderSearchableTrigger() : this.renderStandardTrigger()}
                {this.state.isExpanded && Boolean(options.length) && (
                    <div className="select-options-wrapper" data-qa={`select-options-wrapper-${this.props.id}`}>
                        <SelectList
                            value={this.props.value}
                            onChange={this.handleOptionSelect}
                            options={options}
                            renderer={this.props.optionsRenderer}
                            disableOptionWhen={this.props.disableOptionWhen}
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
        this.clearFilterValue();
        this.collapseOptionsList();
    }

    private toggleOptionsList() {
        if (!this.props.disabled) {
            this.setState((prevState) => ({
                isExpanded: !prevState.isExpanded,
            }));
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

    private onKeyPressed(event: React.KeyboardEvent) {
        if (event.keyCode === KEY_ESCAPE) {
            this.collapseOptionsList();
        }
    }

    private getLabel() {
        const selectedOption = this.props.options.find((option) => isEqual(option.value, this.props.value));
        return selectedOption && selectedOption.label;
    }

    private getSearchTogglePlaceholder() {
        const defaultPlaceholder = this.getLabel() || this.props.placeholder;
        return this.state.isExpanded ? '' : defaultPlaceholder;
    }

    private clearFilterValue() {
        this.setState({
            filterValue: '',
        });
    }

    private onFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            filterValue: event.target.value,
        });
    }

    private setRootNode(node: HTMLDivElement) {
        this.rootNode = node;
    }

    private renderStandardTrigger() {
        const label = this.getLabel();
        const disabledClass = this.props.disabled ? ' disabled' : '';
        const placeholderClass = !label && this.props.placeholder ? ' has-placeholder' : '';
        return (
            <div
                role="button"
                data-qa={`select-toggle--standard-${this.props.id}`}
                className={`select-option-toggle select-option-toggle--standard${disabledClass}${placeholderClass}`}
                aria-haspopup="listbox"
                onClick={this.toggleOptionsList}
            >
                <span className={`text`} data-qa={`select-toggle--standard-text-${this.props.id}`}>
                    {label || this.props.placeholder}
                </span>
                <span className="select-option-toggle--icon-dropdown" />
            </div>
        );
    }

    private renderSearchableTrigger() {
        const label = this.getLabel();
        const disabledClass = this.props.disabled ? ' disabled' : '';
        const placeholderClass = this.state.isExpanded || !label ? ' has-faded-placeholder' : '';
        return (
            <div
                role="button"
                data-qa={`select-toggle--search-${this.props.id}`}
                className={`select-option-toggle select-option-toggle--search${disabledClass}${placeholderClass}`}
                aria-haspopup="listbox"
            >
                {this.getSearchInput()}
            </div>
        );
    }

    private getSearchInput() {
        return (
            <>
                <span className="select-option-toggle--icon-filter" />
                <input
                    id={this.props.id}
                    type="text"
                    className={`text`}
                    autoComplete="off"
                    onChange={this.onFilterChange}
                    value={this.state.filterValue}
                    disabled={this.props.disabled}
                    onClick={this.expandOptionsList}
                    placeholder={this.getSearchTogglePlaceholder()}
                    data-qa={`select-option-toggle--input-${this.props.id}`}
                />
                <button
                    type="button"
                    className="select-option-toggle--icon-clear"
                    onClick={this.clearFilterValue}
                    disabled={!this.state.filterValue.length || this.props.disabled}
                    data-qa={`select-option-toggle--clear-${this.props.id}`}
                />
                <button
                    type="button"
                    className="select-option-toggle--icon-dropdown"
                    onClick={this.toggleOptionsList}
                    data-qa={`select-option-toggle--dropdown-${this.props.id}`}
                    disabled={this.props.disabled}
                />
            </>
        );
    }
}

export { Select };
