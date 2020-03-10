import * as React from 'react';

type Autocomplete = 'on' | 'off';

interface Props {
    id: string;
    value: string;
    disabled?: boolean;
    className?: string;
    searchPlaceholder: string;
    autoComplete?: Autocomplete;
    onFilterChange: (filter: string) => void;
    onClick?: (event: React.MouseEvent) => void;
    trackSearchEvent?: (eventName: string) => void;
    trackEventName?: string;
}

const SearchInput: React.FunctionComponent<Props> = (props) => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!props.disabled) {
            props.onFilterChange(event.target.value);
        }
    };
    const clearSearch = () => {
        if (props.value.length && props.trackSearchEvent && props.trackEventName) {
            props.trackSearchEvent(props.trackEventName);
        }
        if (!props.disabled) {
            props.onFilterChange('');
        }
    };
    return (
        <div className="search-input">
            <span className="search-input-icon-filter" />
            <input
                id={props.id}
                type="text"
                autoComplete={props.autoComplete || 'off'}
                value={props.value}
                className={`search-input-filter ${props.className ? props.className : ''}`}
                onChange={onChange}
                onClick={props.onClick}
                placeholder={props.searchPlaceholder}
                data-qa={`search-input-${props.id}`}
                disabled={props.disabled}
            />
            <button
                type="button"
                className="search-input-icon-clear"
                onClick={clearSearch}
                disabled={!props.value.length || props.disabled}
                data-qa={`${props.id}-clear`}
            />
        </div>
    );
};

export { SearchInput };
