import * as React from 'react';
interface SearchBarProps {
    onFilterChange: (filter: string) => void;
    searchPlaceholder: string;
}
interface TableTopProps extends SearchBarProps {
    hidePagination: boolean;
}
declare const TableTop: React.FunctionComponent<TableTopProps>;
export { TableTop };
