import * as React from 'react';
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
    Header?: string;
    renderHeader?: () => React.ReactNode;
    sortable?: boolean;
    accessor?: (row: ROW) => any;
    renderCell?: (cellContext: CellContext<ROW>) => React.ReactNode;
}
declare enum SortingDirection {
    DESC = "desc",
    ASC = "asc"
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
    minRows?: number;
    getTrProps?: (state: any, row?: ROW) => object | undefined;
}
interface State {
    page: number;
    searchValue: string;
}
declare class Table<ROW> extends React.Component<Props<ROW>, State> {
    constructor(props: Props<ROW>);
    render(): JSX.Element;
    private paginationPropsEnhancer;
    private getPageSize;
    private getData;
    private rowFilter;
    private onFilterChange;
    private getColumns;
    private mapColumns;
    private createDefaultCellRenderer;
    private getActionsColumn;
    private getActionComponent;
    private getVisibleClass;
    private getSortingRules;
    private stringValue;
}
export { Table, ColumnActions, CellContext, Column, Props, Sorting, SortingDirection };
