import * as React from 'react';

interface Props {
    id: string;
    value: string;
    searchPlaceholder: string;
    onFilterChange: (filter: string) => void;
}

const SearchInput: React.FunctionComponent<Props> = (props) => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => props.onFilterChange(event.target.value);
    const clearSearch = () => props.onFilterChange('');
    return (
        <div className="search-input">
            <span className="search-input-icon-filter" />
            <input
                id={props.id}
                type="text"
                value={props.value}
                className="search-input-filter"
                onChange={onChange}
                placeholder={props.searchPlaceholder}
                data-qa={props.id}
            />
            <button
                type="button"
                className="search-input-icon-clear"
                onClick={clearSearch}
                disabled={!props.value.length}
                data-qa={`${props.id}-clear`}
            />
        </div>
    );
};

export { SearchInput };
