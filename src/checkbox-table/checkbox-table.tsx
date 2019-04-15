import update from 'immutability-helper';
import * as React from 'react';
import ReactTable from 'react-table';

import { Checkbox } from '@ampel-ui/checkbox';
import { Label } from '@ampel-ui/label';

interface Column {
    id: string;
    label: string;
}

interface Row {
    id: string;
    label: string;
}

interface CheckboxTableData {
    [key: string]: object;
}

interface DisabledMeta {
    disabled: {
        [key: string]: boolean;
    };
}

interface Props {
    id: string;
    data: CheckboxTableData;
    rows: Array<Row>;
    meta?: DisabledMeta;
    columns: Array<Column>;
    onChange: (data: CheckboxTableData) => void;
    selectAllLabel: string;
    isDisabledCell?: (columnKey: string, rowKey: string) => boolean;
    selectAllColumnLabel: string;
}

const ROW_SELECTION_COLUMN_ID = 'rowSelectionColumn';

const idAccessor = (item: any) => item.id;

class CheckboxTable extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);

        this.setAll = this.setAll.bind(this);
    }

    public render() {
        return (
            <div data-qa={`checkbox-table-${this.props.id}`} className="checkbox-table">
                <ReactTable
                    data={this.getData()}
                    columns={this.getHeaders()}
                    pageSize={this.props.rows.length}
                    resizable={false}
                    showPagination={false}
                    showPaginationTop={false}
                    showPaginationBottom={false}
                />
            </div>
        );
    }

    private getData() {
        return this.props.rows.map((row) => {
            const rowData = this.props.data[row.id];
            return { ...rowData, [ROW_SELECTION_COLUMN_ID]: row.label, id: row.id };
        });
    }

    private getHeaders() {
        const headers = this.getColumnHeaders();
        const selectAllColumnHeader = this.getSelectAllColumnHeader();
        const idColumn = this.getHiddenIdColumn();
        headers.unshift(selectAllColumnHeader as any);
        headers.unshift(idColumn as any);
        return headers;
    }

    private getHiddenIdColumn() {
        return {
            id: 'id',
            show: false,
            accessor: 'id',
            sortable: false,
        };
    }

    private getSelectAllColumnHeader() {
        return {
            id: ROW_SELECTION_COLUMN_ID,
            sortable: false,
            accessor: ROW_SELECTION_COLUMN_ID,
            headerClassName: 'custom-header',
            Cell: (context: any) => (
                <div>
                    <Checkbox
                        id={`${this.props.id}-table--row-${context.row.id}`}
                        value={this.getRowAggregate(context.row.id)}
                        disabled={this.isDisabled(this.getAllColumnKeys(), [context.row.id])}
                        onChange={this.setAllRowValues.bind(this, context.row.id)}
                    />
                    <Label for={`${this.props.id}-table--row-${context.row.id}`} value={context.value} />
                </div>
            ),
            Header: () => (
                <div>
                    <Checkbox
                        id={`${this.props.id}-select-all-column-header`}
                        value={this.getTableAggregate()}
                        disabled={this.isDisabled(this.getAllColumnKeys(), this.getAllRowKeys())}
                        onChange={this.setAll}
                    />
                    <Label for={`${this.props.id}-select-all-column-header`} value={this.props.selectAllLabel} />
                </div>
            ),
        };
    }

    private getColumnHeaders() {
        return this.props.columns.map((column) => {
            return {
                id: column.id,
                sortable: false,
                accessor: column.id,
                headerClassName: 'custom-header',
                Cell: (context: any) => (
                    <Checkbox
                        id={`${this.props.id}-table--row-${context.row.id}-col-${column.id}`}
                        value={context.value}
                        disabled={this.isDisabledCell(column.id, context.row.id)}
                        onChange={this.setCellValue.bind(this, column.id, context.row.id)}
                    />
                ),
                Header: () => (
                    <div>
                        <span>{column.label}</span>
                        <div>
                            <Checkbox
                                id={`${this.props.id}-table--header-${column.id}`}
                                value={this.getColumnAggregate(column.id)}
                                disabled={this.isDisabled([column.id], this.getAllRowKeys())}
                                onChange={this.setAllColumnValues.bind(this, column.id)}
                            />
                            <Label
                                for={`${this.props.id}-table--header-${column.id}`}
                                value={this.props.selectAllColumnLabel}
                            />
                        </div>
                    </div>
                ),
            };
        });
    }

    private setCellValue(columnKey: string, rowKey: string, value: boolean) {
        this.props.onChange(update(this.props.data, { [rowKey]: { [columnKey]: { $set: value } } }));
    }

    private getColumnAggregate(columnKey: string) {
        const allRows = this.getData();
        const enabledRows = this.getAllRowKeys().filter((rowKey) => !this.isDisabledCell(columnKey, rowKey));

        const isEveryCellDisabled = !enabledRows.length;
        if (isEveryCellDisabled) {
            return allRows.map((row) => row[columnKey]).every(Boolean);
        }
        return this.isDisabledOrChecked([columnKey], this.getAllRowKeys());
    }

    private getRowAggregate(rowKey: string) {
        const row = this.props.data[rowKey];
        const enabledColumnKeys = this.getAllColumnKeys().filter(
            (columnKey) => !this.isDisabledCell(columnKey, rowKey)
        );

        const isEveryCellDisabled = !enabledColumnKeys.length;
        if (isEveryCellDisabled) {
            return this.getAllColumnKeys()
                .map((columnKey) => row[columnKey])
                .every(Boolean);
        }
        return this.isDisabledOrChecked(this.getAllColumnKeys(), [rowKey]); // isEveryValueChecked(enabledColumnKeys);
    }

    private getTableAggregate() {
        const allColumnKeys = this.getAllColumnKeys();
        const allRowKeys = this.getAllRowKeys();
        const allDisabled = this.isDisabled(allColumnKeys, allRowKeys);
        if (allDisabled) {
            return this.props.columns.every((column) => this.getColumnAggregate(column.id));
        }
        return this.isDisabledOrChecked(allColumnKeys, allRowKeys);
    }

    private setAllColumnValues(columnKey: string, value: boolean) {
        const rowKeys = this.getAllRowKeys();
        const updateResult = this.createUpdate([columnKey], rowKeys, value);
        this.props.onChange(updateResult);
    }

    private setAllRowValues(rowKey: string, value: boolean) {
        const columnKeys = this.getAllColumnKeys();
        const updateResult = this.createUpdate(columnKeys, [rowKey], value);
        this.props.onChange(updateResult);
    }

    private setAll(value: boolean) {
        const columnKeys = this.getAllColumnKeys();
        const rowKeys = this.getAllRowKeys();
        const updateResult = this.createUpdate(columnKeys, rowKeys, value);
        this.props.onChange(updateResult);
    }

    private getAllColumnKeys() {
        return this.props.columns.map(idAccessor);
    }

    private getAllRowKeys() {
        return this.props.rows.map(idAccessor);
    }

    private createUpdate(columnKeys: Array<string>, rowKeys: Array<string>, value: boolean) {
        let result = this.props.data;
        columnKeys.forEach((columnKey) => {
            rowKeys.forEach((rowKey) => {
                if (this.isDisabledCell(columnKey, rowKey)) {
                    return;
                }
                result = update(result, { [rowKey]: { [columnKey]: { $set: value } } });
            });
        });
        return result;
    }

    private isDisabledOrChecked(columnKeys: Array<string>, rowKeys: Array<string>) {
        const data = this.props.data;
        return columnKeys.every((columnKey) => {
            return rowKeys.every((rowKey) => {
                return this.isDisabledCell(columnKey, rowKey) || data[rowKey][columnKey];
            });
        });
    }

    private isDisabled(columnKeys: Array<string>, rowKeys: Array<string>) {
        return columnKeys.every((columnKey) => {
            return rowKeys.every((rowKey) => {
                return this.isDisabledCell(columnKey, rowKey);
            });
        });
    }

    private isDisabledCell(columnKey: string, rowKey: string) {
        if (this.props.isDisabledCell) {
            return this.props.isDisabledCell(columnKey, rowKey);
        }
        return Boolean(this.props.meta && this.props.meta.disabled[`${rowKey}.${columnKey}`]);
    }
}

export { CheckboxTable, CheckboxTableData, DisabledMeta, Props };
