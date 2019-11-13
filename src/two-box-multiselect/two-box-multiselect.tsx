import { SearchInput } from '@ampel-ui/multi-level-checkbox-editor/search-input';
import * as React from 'react';

import { Option } from '../api/index';
import { matches } from '../common/search';

interface Props<T> {
    id: string;
    values: Array<T>;
    options: Array<Option<T>>;
    onChange: (values: Array<T>) => void;
    labelLeft: string;
    labelRight: string;
    filterPlaceholderLeft?: string;
    filterPlaceholderRight?: string;
    disabled?: boolean;
}

interface State<T> {
    leftFilter: string;
    rightFilter: string;
    leftHighlighted: Array<T>;
    rightHighlighted: Array<T>;
}

const LEFT = 'left';
const RIGHT = 'right';

class TwoBoxMultiselect<T> extends React.Component<Props<T>, State<T>> {
    constructor(props: Props<T>) {
        super(props);

        this.state = {
            leftFilter: '',
            rightFilter: '',
            leftHighlighted: [],
            rightHighlighted: [],
        };

        this.addAll = this.addAll.bind(this);
        this.removeAll = this.removeAll.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.isHighlighted = this.isHighlighted.bind(this);
        this.isNotSelected = this.isNotSelected.bind(this);
        this.addHighlighted = this.addHighlighted.bind(this);
        this.removeHighlighted = this.removeHighlighted.bind(this);
        this.toggleHighlighted = this.toggleHighlighted.bind(this);
        this.renderOptionForSide = this.renderOptionForSide.bind(this);
    }

    public render() {
        return (
            <div data-qa={`two-box-multiselect-${this.props.id}`} className={`two-box-multiselect`}>
                <div data-qa={`two-box-multiselect--left-${this.props.id}`} className="two-box-multiselect-box">
                    <div
                        className="two-box-multiselect-label"
                        data-qa={`two-box-multiselect--left-label-${this.props.id}`}
                    >
                        {this.props.labelLeft}
                    </div>
                    {this.renderLeftBox()}
                </div>
                <div data-qa={`two-box-multiselect--control-${this.props.id}`} className="two-box-multiselect-center">
                    {this.renderControlPanel()}
                </div>
                <div data-qa={`two-box-multiselect--right-${this.props.id}`} className="two-box-multiselect-box">
                    <div
                        className="two-box-multiselect-label"
                        data-qa={`two-box-multiselect--right-label-${this.props.id}`}
                    >
                        {this.props.labelRight}
                    </div>
                    {this.renderRightBox()}
                </div>
            </div>
        );
    }

    private changeFilter(side: string, value: string) {
        const key = `${side}Filter`;
        const update = this.createUpdate(key, value);
        this.setState(update);
    }

    private renderControlPanel() {
        return (
            <div className="two-box-multiselect-control-panel">
                <div className="add-buttons">
                    {this.getControlButton(this.addAll, 'add-all')}
                    {this.getControlButton(this.addHighlighted, 'add-highlighted')}
                </div>
                <div className="remove-buttons">
                    {this.getControlButton(this.removeHighlighted, 'remove-highlighted')}
                    {this.getControlButton(this.removeAll, 'remove-all')}
                </div>
            </div>
        );
    }

    private getControlButton(onClick: () => void, key: string) {
        return (
            <button
                type="button"
                onClick={onClick}
                data-qa={`two-box-multiselect--${key}-${this.props.id}`}
                tabIndex={-1}
                className={`action-button ${key}-button ${this.props.disabled && 'disabled'}`}
                disabled={this.props.disabled}
            >
                <span className={key} />
            </button>
        );
    }

    private renderOptions(options: Array<Option<T>>, side: string) {
        const onChange = (value: string) => this.changeFilter(side, value);
        return (
            <div className={`two-box-multiselect-select-box`}>
                <div className="two-box-multiselect-filter-bar">
                    <SearchInput
                        id={`two-box-multiselect--${side}-filter-${this.props.id}`}
                        value={this.getFilterValue(side)}
                        searchPlaceholder={this.getFilterPlaceholder(side)}
                        onFilterChange={onChange}
                    />
                </div>
                <ul className={`two-box-option-items option-items-${side} ${this.props.disabled && 'disabled'}`}>
                    {options.map(
                        this.renderOptionForSide(
                            side,
                            (option) => this.isHighlighted(this.state, side, option.value),
                            (option) => this.toggleHighlighted(side, option)
                        )
                    )}
                </ul>
            </div>
        );
    }

    private getFilterPlaceholder(side: string) {
        return (side === LEFT ? this.props.filterPlaceholderLeft : this.props.filterPlaceholderRight) || '';
    }

    private getFilterValue(side: string) {
        return side === LEFT ? this.state.leftFilter : this.state.rightFilter;
    }

    private renderOptionForSide(
        side: string,
        isHighlighted: (option: Option<T>) => boolean,
        toggle: (option: Option<T>) => void
    ) {
        return (option: Option<T>) => {
            const highlighted = isHighlighted(option);
            const onClick = () => !this.props.disabled && toggle(option);
            const onDoubleClick = () => !this.props.disabled && this.handleDoubleClick(side, option);
            return (
                <li
                    key={`${option.value}`}
                    role="option"
                    onClick={onClick}
                    data-qa={`two-box-multiselect--${side}-item-${option.label}`}
                    className={`item ${highlighted ? 'highlighted' : ''}`}
                    aria-selected={highlighted}
                    onDoubleClick={onDoubleClick}
                >
                    {option.label}
                </li>
            );
        };
    }

    private handleDoubleClick(side: string, option: Option<T>) {
        if (side === LEFT) {
            this.addValues([option.value]);
        } else {
            this.removeValues([option.value]);
        }
    }

    private removeHighlighted() {
        const highlightedValues = this.props.values.filter((value) => this.isHighlighted(this.state, RIGHT, value));
        this.resetRightHighlighted();
        this.removeValues(highlightedValues);
    }

    private removeAll() {
        this.resetRightHighlighted();
        this.props.onChange([]);
    }

    private resetRightHighlighted() {
        this.setState({ rightHighlighted: [] });
    }

    private addAll() {
        const newValues = this.props.options
            .filter(this.isNotSelected)
            .map((option) => option.value)
            .concat(this.props.values);
        this.resetLeftHighlighted();
        return this.props.onChange(newValues);
    }

    private addHighlighted() {
        const highlightedValues = this.props.options
            .filter((option) => this.isHighlighted(this.state, LEFT, option.value))
            .map((option) => option.value);
        this.resetLeftHighlighted();
        this.addValues(highlightedValues);
    }

    private resetLeftHighlighted() {
        this.setState({ leftHighlighted: [] });
    }

    private addValues(valuesToBeAdded: Array<T>) {
        const allValues = this.props.values.concat(valuesToBeAdded);
        return this.props.onChange(allValues);
    }

    private removeValues(valuesToBeRemoved: Array<T>) {
        const newValues = this.props.values.filter((value) => !valuesToBeRemoved.includes(value));
        this.props.onChange(newValues);
    }

    private isSelected(option: Option<T>) {
        return this.props.values.includes(option.value);
    }

    private isNotSelected(option: Option<T>) {
        return !this.isSelected(option);
    }

    private renderLeftBox() {
        const notSelectedOptions = this.props.options
            .filter(this.isNotSelected)
            .filter((option) => matches(this.state.leftFilter, option.label));
        return this.renderOptions(notSelectedOptions, LEFT);
    }

    private renderRightBox() {
        const selectedOptions = this.props.options
            .filter(this.isSelected)
            .filter((option) => matches(this.state.rightFilter, option.label));
        return this.renderOptions(selectedOptions, RIGHT);
    }

    private toggleHighlighted(side: string, option: Option<T>) {
        this.setState((prevState) => {
            const highlighted = this.isHighlighted(prevState, side, option.value)
                ? this.removeHighlight(prevState, side, option)
                : this.addHighlight(prevState, side, option);
            const key = `${side}Highlighted`;
            return this.createUpdate(key, highlighted);
        });
    }

    private createUpdate<V>(key: string, value: V) {
        const obj = {};
        obj[key] = value;
        return obj;
    }

    private isHighlighted(state: State<T>, side: string, value: T) {
        const highlightedCollection = this.getHighlightedCollection(side, state);
        return highlightedCollection.includes(value);
    }

    private addHighlight(state: State<T>, side: string, option: Option<T>) {
        const highlightedCollection = this.getHighlightedCollection(side, state);
        return highlightedCollection.concat([option.value]);
    }

    private removeHighlight(state: State<T>, side: string, option: Option<T>) {
        const highlightedCollection = this.getHighlightedCollection(side, state);
        return highlightedCollection.filter((value) => option.value !== value);
    }

    private getHighlightedCollection(side: string, state: State<T>) {
        return side === LEFT ? state.leftHighlighted : state.rightHighlighted;
    }
}

export { TwoBoxMultiselect };
