import * as React from 'react';

import { Select } from '../select';

interface PaginationButtonProps {
    id: string;
    onClick: () => void;
    disabled: boolean;
    className: string;
}

enum PaginateEvent {
    FIRST = 'FIRST',
    LAST = 'LAST',
    NEXT = 'NEXT',
    PREVIOUS = 'PREVIOUS',
    SIZE = 'SIZE'
}

const getPaginationButton = (props: PaginationButtonProps) => {
    const { id, ...rest } = props;
    return <button key={id} type="button" data-qa={`table-pagination--${id}`} {...rest} />;
};

const Pagination: React.FunctionComponent<any> = (props) => {
    const {
        page,
        pages,
        pageSizeOptions,
        pageSize,
        onPaginate,
        canPrevious,
        canNext,
        ofText,
        pageText,
        rowsText,
        onPageSizeChange: changePageSize,
        onPageChange: changePage,
    } = props;
    const onPaginateHandler = (eventType: PaginateEvent, itemsPerPage?: number) => onPaginate && onPaginate(eventType, itemsPerPage);
    const onSizeChange = (value: any) => {
        onPaginateHandler(PaginateEvent.SIZE, Number(value));
        changePageSize(Number(value));
    };
    const onPageChange = (e: React.ChangeEvent<HTMLInputElement>) => changePage(Number(e.target.value) - 1);
    const firstPage = () => {
        onPaginateHandler(PaginateEvent.FIRST);
        changePage(0);
    };
    const incrementPage = () => {
        onPaginateHandler(PaginateEvent.NEXT);
        changePage(page + 1);
    };
    const decreasePage = () => {
        onPaginateHandler(PaginateEvent.PREVIOUS);
        changePage(page - 1);
    };
    const lastPage = () => {
        onPaginateHandler(PaginateEvent.LAST);
        changePage(pages);
    };
    return (
        <div className="table-pagination">
            <div className="table-pagination-buttons">
                {[
                    {
                        id: 'first',
                        onClick: firstPage,
                        disabled: !canPrevious,
                        className: 'table-pagination-button table-pagination-first',
                    },
                    {
                        id: 'previous',
                        onClick: decreasePage,
                        disabled: !canPrevious,
                        className: 'table-pagination-button table-pagination-previous',
                    },
                    {
                        id: 'next',
                        onClick: incrementPage,
                        disabled: !canNext,
                        className: 'table-pagination-button table-pagination-next',
                    },
                    {
                        id: 'last',
                        onClick: lastPage,
                        disabled: !canNext,
                        className: 'table-pagination-button table-pagination-last',
                    },
                ].map(getPaginationButton)}
            </div>
            <div className="pagination-current-page">
                {pageText}
                <input
                    type="number"
                    value={page + 1}
                    data-qa={`table-pagination--page-spin`}
                    onChange={onPageChange}
                    className="pagination-current-page-spin"
                    aria-valuemax={pages}
                    aria-valuemin={1}
                    aria-valuenow={page}
                />
                {ofText} {pages}
            </div>
            <div className="pagination-rows">
                <Select
                    id={'table-pagination-rows'}
                    value={pageSize}
                    options={pageSizeOptions.map((option: any) => ({ value: option, label: `${option} ${rowsText}` }))}
                    onChange={onSizeChange}
                />
            </div>
        </div>
    );
};

interface SearchBarProps {
    onFilterChange: (filter: string) => void;
    searchPlaceholder: string;
}

const SearchBar: React.FunctionComponent<SearchBarProps> = (props) => {
    // TODO: useCallback ASAP
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => props.onFilterChange(event.target.value);
    return (
        <div className="search-bar">
            <input
                type="text"
                data-qa={`table--search-bar`}
                onChange={onChange}
                className="search-bar-filter"
                placeholder={props.searchPlaceholder}
            />
            <span className="search-bar-icon" />
        </div>
    );
};

interface TableTopProps extends SearchBarProps {
    hidePagination: boolean;
}

const TableTop: React.FunctionComponent<TableTopProps> = (props) => {
    return (
        <div className="table-top">
            <SearchBar onFilterChange={props.onFilterChange} searchPlaceholder={props.searchPlaceholder} />
            {!props.hidePagination && <Pagination {...props} />}
        </div>
    );
};

export { TableTop, PaginateEvent };
