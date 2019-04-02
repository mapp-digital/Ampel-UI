import * as React from 'react';
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
    selectAllColumnLabel: string;
}
declare class CheckboxTable extends React.Component<Props, {}> {
    constructor(props: Props);
    render(): JSX.Element;
    private getData;
    private getHeaders;
    private getHiddenIdColumn;
    private getSelectAllColumnHeader;
    private getColumnHeaders;
    private setCellValue;
    private getColumnAggregate;
    private getRowAggregate;
    private getTableAggregate;
    private setAllColumnValues;
    private setAllRowValues;
    private setAll;
    private getAllColumnKeys;
    private getAllRowKeys;
    private createUpdate;
    private isDisabledOrChecked;
    private isDisabled;
    private isDisabledCell;
}
export { CheckboxTable, CheckboxTableData, DisabledMeta, Props };
