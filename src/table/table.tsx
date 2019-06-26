import * as React from 'react';

import ReactTable, { SortingRule } from 'react-table';
import { RowInfo } from 'react-table';

import { matches } from '../common/search';
import { Tooltip } from '../tooltip';
import { PaginateEvent, TableTop } from './table-top';

interface TableAction<T> {
    id: string;
    hidden?: boolean | ((row: T) => boolean);
    onClick: (row: T) => void;
    tooltip?: string;
    disabled?: boolean | ((row: T) => boolean);
    iconClass: string;
}

interface ColumnActions<ROW> {
    Header: string;
    actions: Array<TableAction<ROW>>;
}

interface CellContext<ROW> {
    row: ROW;
    value: any;
    index: number;
    viewIndex: number;
    column: Column<ROW>;
}

interface Column<ROW> {
    id: string;
    hidden?: boolean;
    minWidth?: number;
    maxWidth?: number;
    Header?: string;
    renderHeader?: () => React.ReactNode;
    sortable?: boolean;
    accessor?: (row: ROW) => any;
    renderCell?: (cellContext: CellContext<ROW>) => React.ReactNode;
}

interface InternalColumn {
    id: string;
    Header: string | ((headerContext: any) => React.ReactNode);
    sortable?: boolean;
}

enum SortingDirection {
    DESC = 'desc',
    ASC = 'asc',
}

interface Sorting {
    column: string;
    direction: SortingDirection;
}

interface Props<ROW> {
    id: string;
    data: Array<ROW>;
    ofText: string;
    columns: Array<Column<ROW>>;
    elastic?: boolean;
    pageText: string;
    pageSize?: number;
    searchPlaceholder?: string;
    columnActions?: ColumnActions<ROW>;
    initiallySortBy?: Array<Sorting>;
    onPaginate?: (eventType: PaginateEvent, itemsPerPage?: number) => void;
    minRows?: number;
    getRowProps?: (row?: ROW) => object;
    onSortedChange?: (newSorted: Array<SortingRule>, column: any, shiftKey: boolean) => void;
    onFilterChange?: (data: string) => void
}

interface State {
    page: number;
    searchValue: string;
}

class Table<ROW> extends React.Component<Props<ROW>, State> {
    constructor(props: Props<ROW>) {
        super(props);

        this.state = {
            page: 0,
            searchValue: '',
        };

        this.rowFilter = this.rowFilter.bind(this);
        this.mapColumns = this.mapColumns.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.paginationPropsEnhancer = this.paginationPropsEnhancer.bind(this);
        this.getTrProps = this.getTrProps.bind(this);
    }

    public render() {
        const data = this.getData();
        const noDataComponent = () => <div />;
        return (
            <div data-qa={`table-${this.props.id}`} className="table">
                <ReactTable
                    data={data}
                    ofText={this.props.ofText}
                    columns={this.getColumns()}
                    pageText={this.props.pageText}
                    pageSize={this.getPageSize(data.length)}
                    resizable={false}
                    showPagination={true}
                    NoDataComponent={noDataComponent}
                    showPaginationTop={true}
                    getPaginationProps={this.paginationPropsEnhancer}
                    PaginationComponent={TableTop}
                    showPaginationBottom={false}
                    defaultSorted={this.getSortingRules()}
                    minRows={this.props.minRows}
                    getTrProps={this.getTrProps}
                    onSortedChange={this.props.onSortedChange}
                />
            </div>
        );
    }

    private paginationPropsEnhancer(paginationProps: any) {
        paginationProps.onFilterChange = this.onFilterChange;
        paginationProps.onPaginate = this.props.onPaginate;
        paginationProps.searchPlaceholder = this.props.searchPlaceholder;
        paginationProps.hidePagination = this.props.elastic;
        return paginationProps;
    }

    private getPageSize(dataCount: number) {
        const pagesize = Number.isInteger(this.props.pageSize!) ? this.props.pageSize : undefined;
        return this.props.elastic ? dataCount : pagesize;
    }

    private getData() {
        return this.props.data.filter(this.rowFilter);
    }

    private rowFilter(row: any) {
        return Object.keys(row).find((key) => matches(this.state.searchValue, this.stringValue(row[key])));
    }

    private onFilterChange(filter: string) {
        this.setState({ searchValue: filter }, () => {
            if (this.props.onFilterChange) {
                this.props.onFilterChange(this.state.searchValue)
            }
        });
    }

    private getColumns() {
        const internalColumns: Array<InternalColumn> = this.props.columns.map(this.mapColumns);
        if (this.props.columnActions) {
            return internalColumns.concat([this.getActionsColumn(this.props.columnActions)]);
        }
        return internalColumns;
    }

    private mapColumns(column: Column<ROW>) {
        const defaultHeader = () => (
            <div>
                {column.Header} <span className="header-icon" />
            </div>
        );
        return {
            ...column,
            id: column.id,
            sortable: Boolean(column.sortable),
            accessor: column.accessor || ((row: ROW) => row[column.id]),
            show: !column.hidden,
            Cell: column.renderCell || this.createDefaultCellRenderer(column),
            Header: column.renderHeader || defaultHeader,
        };
    }

    private createDefaultCellRenderer = (column: Column<ROW>) => {
        return (props: CellContext<ROW>) => {
            return (
                <span data-qa={`table--row-${props.viewIndex}-col-${column.id}`}>{this.stringValue(props.value)}</span>
            );
        };
    };

    private getActionsColumn(columnActions: ColumnActions<ROW>) {
        const actionButtonWidthPx = 30;
        return {
            id: '_actions',
            sortable: false,
            width: Math.max(100, columnActions.actions.length * actionButtonWidthPx),
            Header: () => <div className="actions-header">{columnActions.Header}</div>,
            Cell: (props: any) => {
                return (
                    <div className="table-actions-cell">
                        {columnActions.actions.map((action) => this.getActionComponent(action, props))}
                    </div>
                );
            },
        };
    }

    private getActionComponent(action: TableAction<ROW>, cellProps: any) {
        const row = cellProps.original;
        const onClick = () => action.onClick(row);
        const button = (
            <button
                key={action.id}
                type="button"
                onClick={onClick}
                data-qa={`table--row-${cellProps.index}-col-_actions--${action.id}`}
                disabled={typeof action.disabled === 'function' ? action.disabled(row) : action.disabled}
                className={`action-button ${action.iconClass} ${this.getVisibleClass(action, row)}`}
            />
        );
        return !action.tooltip ? (
            button
        ) : (
                <Tooltip key={action.id} text={action.tooltip} placement="top">
                    {button}
                </Tooltip>
            );
    }

    private getVisibleClass(action: TableAction<ROW>, row: any): string {
        const hidden = typeof action.hidden === 'function' ? action.hidden(row) : action.hidden;
        return hidden ? 'invisible' : '';
    }

    private getSortingRules(): Array<any> {
        if (this.props.initiallySortBy) {
            return this.props.initiallySortBy.map((rule) => ({
                id: rule.column,
                [rule.direction]: true,
            }));
        }
        return [];
    }

    private stringValue(value: any): string {
        return Array.isArray(value) ? value.map(this.stringValue).join(', ') : String(value);
    }

    private getTrProps(state: any, rowInfo: RowInfo) {
        if (!this.props.getRowProps) {
            return {};
        }
        return this.props.getRowProps(rowInfo.row);
    }
}

export { Table, ColumnActions, CellContext, Column, Props, Sorting, SortingDirection };
