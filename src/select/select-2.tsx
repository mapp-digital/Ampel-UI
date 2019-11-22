import { matches } from '@ampel-ui/common/search';
import * as React from 'react';

import { isEqual } from 'lodash';

import { SearchInput } from '@ampel-ui/input';
import { onOuterClick } from '@ampel-ui/subscriptions';

import { Option } from '../api/index';

import { RendererProps, SelectList } from './select-list';

interface Props<T, O extends Option<T>> {
    id: string;
    value: T;
    options: Array<O>;
    onChange: (value: T) => void;
    searchable?: boolean;
    disabled?: boolean;
    optionsRenderer?: (props: RendererProps<T, O>) => JSX.Element;
}

interface State<T, O> {
    isExpanded: boolean;
    filterValue: string;
    options: Array<O>;
}

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
            isExpanded: false,
            filterValue: '',
            options: this.props.options,
        };

        this.onFilterChange = this.onFilterChange.bind(this);
        this.toggleOptionsList = this.toggleOptionsList.bind(this);
        this.collapseOptionsList = this.collapseOptionsList.bind(this);
    }

    public componentDidMount() {
        this.dispose = onOuterClick(this.rootNode, this.collapseOptionsList);
    }

    public componentWillUnmount() {
        this.dispose();
    }

    public render() {
        return (
            <div ref={this.refHandlers.rootNode} role="button" tabIndex={-1} className="select-component">
                {this.props.searchable ? this.renderSearchableTrigger() : this.renderStandardTrigger()}
                {this.state.isExpanded && (
                    <SelectList
                        options={this.state.options}
                        onChange={this.props.onChange}
                        renderer={this.props.optionsRenderer}
                        value={this.props.value}
                    />
                )}
            </div>
        );
    }

    private toggleOptionsList() {
        this.setState((prevState) => ({
            isExpanded: !prevState.isExpanded,
        }));
    }

    private collapseOptionsList() {
        this.setState({
            isExpanded: false,
        });
    }

    private onFilterChange(filterValue: string) {
        const filteredOptions = this.props.options.filter((option) => matches(filterValue, option.label));
        this.setState({
            filterValue,
            options: filteredOptions,
        });
    }

    private getLabel() {
        const selectedOption = this.props.options.find((option) => isEqual(option.value, this.props.value));
        return selectedOption && selectedOption.label;
    }

    private renderStandardTrigger() {
        const label = this.getLabel();
        return (
            <div
                role="button"
                data-qa={`select--toggle-${this.props.id}`}
                className={`select-option-toggle ${this.props.disabled ? 'disabled' : ''}`}
                aria-haspopup="listbox"
                onClick={this.toggleOptionsList}
            >
                <span className="text" data-qa={`select--toggle-text-${this.props.id}`}>
                    {label}
                </span>
                <span className="arrow" />
            </div>
        );
    }

    private renderSearchableTrigger() {
        const label = this.getLabel();
        return (
            <div
                role="button"
                data-qa={`select--toggle-${this.props.id}`}
                className={`select-option-toggle ${this.props.disabled ? 'disabled' : ''}`}
                aria-haspopup="listbox"
                onClick={this.toggleOptionsList}
            >
                <SearchInput
                    id="search-input"
                    value={this.state.filterValue}
                    searchPlaceholder={label || 'Search...'}
                    onFilterChange={this.onFilterChange}
                />
            </div>
        );
    }
}

export { Select2 };
