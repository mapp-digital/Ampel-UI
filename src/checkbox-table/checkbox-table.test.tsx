import * as React from 'react';

import { cleanup, render } from '@config/testing';

import { CheckboxTable, CheckboxTableProps } from './';

const onChange = jest.fn();

const getTwoColumns = () => [
    {
        id: 'someFlag',
        label: 'Some Flag',
    },
    {
        id: 'someOtherFlag',
        label: 'Some Other Flag',
    },
];

const getTwoRows = () => [
    {
        id: 'someEntry',
        label: 'Some Entry',
    },
    {
        id: 'someOtherEntry',
        label: 'Some Other Entry',
    },
];

const getAllTrueData = () => ({
    someEntry: {
        someFlag: true,
        someOtherFlag: true,
    },
    someOtherEntry: {
        someFlag: true,
        someOtherFlag: true,
    },
});

const getCheckboxTable = (props: CheckboxTableProps) => <CheckboxTable {...props} />;
const defaultProps = { id: 'someId', selectAllColumnLabel: '', selectAllLabel: '' };

describe('Table', () => {
    afterEach(cleanup);

    it('should exist', () => {
        const id = 'someId';
        const { queryByDataQa } = render(
            getCheckboxTable({ ...defaultProps, data: {}, columns: [], rows: [], onChange })
        );
        const table = queryByDataQa(`checkbox-table-${id}`);
        expect(table).toBeTruthy();
    });

    it('should have contents accessible', () => {
        const someFlag = true;
        const data = {
            someEntry: {
                someFlag,
            },
        };
        const columns = [
            {
                id: 'someFlag',
                label: 'Some Flag',
            },
        ];
        const rows = [
            {
                id: 'someEntry',
                label: 'Some Entry',
            },
        ];
        const { getByDataQa } = render(getCheckboxTable({ ...defaultProps, data, columns, rows, onChange }));
        const cell = getByDataQa(`checkbox-someId-table--row-someEntry-col-someFlag`) as HTMLInputElement;
        expect(cell.checked).toEqual(someFlag);
    });

    it(`should represent column state as 'true' when ALL of its values are 'true'`, () => {
        const someFlag = true;
        const data = {
            someEntry: {
                someFlag,
            },
            someOtherEntry: {
                someFlag,
            },
        };
        const columns = [
            {
                id: 'someFlag',
                label: 'Some Flag',
            },
        ];
        const rows = getTwoRows();
        const { getByDataQa } = render(getCheckboxTable({ ...defaultProps, data, columns, rows, onChange }));
        const header = getByDataQa(`checkbox-someId-table--header-someFlag`) as HTMLInputElement;
        expect(header.checked).toEqual(someFlag);
    });

    it(`should represent column state as 'false' when ONE of its values is 'false'`, () => {
        const data = {
            someEntry: {
                someFlag: true,
            },
            someOtherEntry: {
                someFlag: false,
            },
        };
        const columns = [
            {
                id: 'someFlag',
                label: 'Some Flag',
            },
        ];
        const rows = getTwoRows();
        const { getByDataQa } = render(getCheckboxTable({ ...defaultProps, data, columns, rows, onChange }));
        const header = getByDataQa(`checkbox-someId-table--header-someFlag`) as HTMLInputElement;
        expect(header.checked).toEqual(false);
    });

    it(`should represent row state as 'true' when ALL of its values are 'true'`, () => {
        const someFlag = true;
        const data = {
            someEntry: {
                someFlag,
                someOtherFlag: someFlag,
            },
        };
        const columns = getTwoColumns();
        const rows = [
            {
                id: 'someEntry',
                label: 'Some Entry',
            },
        ];
        const { getByDataQa } = render(getCheckboxTable({ ...defaultProps, data, columns, rows, onChange }));
        const header = getByDataQa(`checkbox-someId-table--row-someEntry`) as HTMLInputElement;
        expect(header.checked).toEqual(someFlag);
    });

    it(`should represent row state as 'false' when ONE of its values is 'false'`, () => {
        const data = {
            someEntry: {
                someFlag: true,
                someOtherFlag: false,
            },
        };
        const columns = getTwoColumns();
        const rows = [
            {
                id: 'someEntry',
                label: 'Some Entry',
            },
        ];
        const { getByDataQa } = render(getCheckboxTable({ ...defaultProps, data, columns, rows, onChange }));
        const header = getByDataQa(`checkbox-someId-table--row-someEntry`) as HTMLInputElement;
        expect(header.checked).toEqual(false);
    });

    it(`should represent total table state as 'true' when ALL of its values are 'true'`, () => {
        const data = getAllTrueData();
        const columns = getTwoColumns();
        const rows = getTwoRows();
        const { getByDataQa } = render(getCheckboxTable({ ...defaultProps, data, columns, rows, onChange }));
        const totalHeaderCheckbox = getByDataQa(`checkbox-someId-select-all-column-header`) as HTMLInputElement;
        expect(totalHeaderCheckbox.checked).toEqual(true);
    });

    it(`should represent total table state as 'false' when ONE of its values is 'false'`, () => {
        const data = {
            someEntry: {
                someFlag: true,
                someOtherFlag: false,
            },
            someOtherEntry: {
                someFlag: true,
                someOtherFlag: true,
            },
        };
        const columns = getTwoColumns();
        const rows = getTwoRows();
        const { getByDataQa } = render(getCheckboxTable({ ...defaultProps, data, columns, rows, onChange }));
        const totalHeaderCheckbox = getByDataQa(`checkbox-someId-select-all-column-header`) as HTMLInputElement;
        expect(totalHeaderCheckbox.checked).toEqual(false);
    });

    it(`should toggle a certain value when it's cell checkbox is clicked`, () => {
        const changeHandler = jest.fn();
        const someValue = true;
        const data = getAllTrueData();
        const columns = getTwoColumns();
        const rows = getTwoRows();
        const { getByDataQa } = render(
            getCheckboxTable({ ...defaultProps, data, columns, rows, onChange: changeHandler })
        );
        const cell = getByDataQa(`checkbox-someId-table--row-someEntry-col-someFlag`) as HTMLInputElement;
        cell.click();
        expect(changeHandler).toHaveBeenCalledWith({
            someEntry: {
                someFlag: false,
                someOtherFlag: someValue,
            },
            someOtherEntry: {
                someFlag: someValue,
                someOtherFlag: someValue,
            },
        });
    });

    it(`should set all of it's values when a column checkbox is clicked`, () => {
        const changeHandler = jest.fn();
        const someValue = true;
        const data = getAllTrueData();
        const columns = getTwoColumns();
        const rows = getTwoRows();

        const { getByDataQa } = render(
            getCheckboxTable({ ...defaultProps, data, columns, rows, onChange: changeHandler })
        );
        const columnCheckbox = getByDataQa(`checkbox-someId-table--header-someFlag`) as HTMLInputElement;
        columnCheckbox.click();

        expect(changeHandler).toHaveBeenCalledWith({
            someEntry: {
                someFlag: false,
                someOtherFlag: someValue,
            },
            someOtherEntry: {
                someFlag: false,
                someOtherFlag: someValue,
            },
        });
    });

    it(`should set all of it's values when a row checkbox is clicked`, () => {
        const changeHandler = jest.fn();
        const someValue = true;
        const data = getAllTrueData();
        const columns = getTwoColumns();
        const rows = getTwoRows();

        const { getByDataQa } = render(
            getCheckboxTable({ ...defaultProps, data, columns, rows, onChange: changeHandler })
        );
        const columnCheckbox = getByDataQa(`checkbox-someId-table--row-someEntry`) as HTMLInputElement;
        columnCheckbox.click();

        expect(changeHandler).toHaveBeenCalledWith({
            someEntry: {
                someFlag: false,
                someOtherFlag: false,
            },
            someOtherEntry: {
                someFlag: someValue,
                someOtherFlag: someValue,
            },
        });
    });

    it(`should set all of it's values when 'checkbox-select-all-column' checkbox is clicked`, () => {
        const changeHandler = jest.fn();
        const data = getAllTrueData();
        const columns = getTwoColumns();
        const rows = getTwoRows();

        const { getByDataQa } = render(
            getCheckboxTable({ ...defaultProps, data, columns, rows, onChange: changeHandler })
        );
        const columnCheckbox = getByDataQa(`checkbox-someId-select-all-column-header`) as HTMLInputElement;
        columnCheckbox.click();

        expect(changeHandler).toHaveBeenCalledWith({
            someEntry: {
                someFlag: false,
                someOtherFlag: false,
            },
            someOtherEntry: {
                someFlag: false,
                someOtherFlag: false,
            },
        });
    });

    it(`should NOT toggle a certain value when it's DISABLED cell checkbox is clicked`, () => {
        const changeHandler = jest.fn();
        const data = getAllTrueData();

        const meta = {
            disabled: {
                'someEntry.someFlag': true,
            },
        };

        const columns = getTwoColumns();
        const rows = getTwoRows();
        const { getByDataQa } = render(
            getCheckboxTable({ ...defaultProps, data, meta, columns, rows, onChange: changeHandler })
        );
        const cell = getByDataQa(`checkbox-someId-table--row-someEntry-col-someFlag`) as HTMLInputElement;
        cell.click();
        expect(changeHandler).not.toHaveBeenCalled();
    });

    it('should NOT toggle any value when `isCellDisabled` is set to `true`', () => {
        const changeHandler = jest.fn();
        const isDisabledCell = () => true;
        const data = getAllTrueData();
        const columns = getTwoColumns();
        const rows = getTwoRows();

        const { getByDataQa } = render(
            getCheckboxTable({...defaultProps, data, columns, rows, onChange: changeHandler, isDisabledCell})
        );

        const firstCell = getByDataQa(`checkbox-someId-table--row-someEntry-col-someFlag`) as HTMLInputElement;
        firstCell.click();

        const secondCell = getByDataQa(`checkbox-someId-table--row-someOtherEntry-col-someOtherFlag`) as HTMLInputElement;
        secondCell.click();

        expect(changeHandler).not.toHaveBeenCalled();
    });

    it(`should NOT change a DISABLED value when it's column checkbox is clicked`, () => {
        const changeHandler = jest.fn();
        const data = getAllTrueData();

        const meta = {
            disabled: {
                'someEntry.someFlag': true,
            },
        };

        const columns = getTwoColumns();
        const rows = getTwoRows();
        const { getByDataQa } = render(
            getCheckboxTable({ ...defaultProps, data, meta, columns, rows, onChange: changeHandler })
        );
        const columnCheckbox = getByDataQa(`checkbox-someId-table--header-someFlag`) as HTMLInputElement;
        columnCheckbox.click();

        const initialValue = true;
        expect(changeHandler).toHaveBeenCalledWith({
            someEntry: {
                someFlag: initialValue,
                someOtherFlag: initialValue,
            },
            someOtherEntry: {
                someFlag: false,
                someOtherFlag: initialValue,
            },
        });
    });

    it(`should mark a column as checked when all it's editable values are checked`, () => {
        const changeHandler = jest.fn();
        const data = getAllTrueData();

        data.someEntry.someFlag = false;
        const meta = {
            disabled: {
                'someEntry.someFlag': true,
            },
        };

        const columns = getTwoColumns();
        const rows = getTwoRows();
        const { getByDataQa } = render(
            getCheckboxTable({ ...defaultProps, data, meta, columns, rows, onChange: changeHandler })
        );
        const columnCheckbox = getByDataQa(`checkbox-someId-table--header-someFlag`) as HTMLInputElement;
        expect(columnCheckbox.checked).toBeTruthy();
    });

    it(`should NOT mark a column as checked when all it's values are disabled but not all checked`, () => {
        const changeHandler = jest.fn();
        const data = getAllTrueData();

        data.someEntry.someFlag = false;
        const meta = {
            disabled: {
                'someEntry.someFlag': true,
                'someOtherEntry.someFlag': true,
            },
        };

        const columns = getTwoColumns();
        const rows = getTwoRows();
        const { getByDataQa } = render(
            getCheckboxTable({ ...defaultProps, data, meta, columns, rows, onChange: changeHandler })
        );
        const columnCheckbox = getByDataQa(`checkbox-someId-table--header-someFlag`) as HTMLInputElement;
        expect(columnCheckbox.checked).toBeFalsy();
    });

    it(`should mark a row as checked when all it's editable values are checked`, () => {
        const changeHandler = jest.fn();
        const data = getAllTrueData();

        data.someEntry.someFlag = false;
        const meta = {
            disabled: {
                'someEntry.someFlag': true,
            },
        };

        const columns = getTwoColumns();
        const rows = getTwoRows();
        const { getByDataQa } = render(
            getCheckboxTable({ ...defaultProps, data, meta, columns, rows, onChange: changeHandler })
        );
        const rowCheckbox = getByDataQa(`checkbox-someId-table--row-someEntry`) as HTMLInputElement;
        expect(rowCheckbox.checked).toBeTruthy();
    });

    it(`should NOT mark a row as checked when all it's values are disabled but not all checked`, () => {
        const changeHandler = jest.fn();
        const data = getAllTrueData();

        data.someEntry.someFlag = false;
        const meta = {
            disabled: {
                'someEntry.someFlag': true,
                'someEntry.someOtherFlag': true,
            },
        };

        const columns = getTwoColumns();
        const rows = getTwoRows();
        const { getByDataQa } = render(
            getCheckboxTable({ ...defaultProps, data, meta, columns, rows, onChange: changeHandler })
        );
        const rowCheckbox = getByDataQa(`checkbox-someId-table--row-someEntry`) as HTMLInputElement;
        expect(rowCheckbox.checked).toBeFalsy();
    });

    it(`should NOT mark 'all-checked' as checked when all it's values are disabled but not all checked`, () => {
        const changeHandler = jest.fn();
        const data = getAllTrueData();

        data.someEntry.someFlag = false;
        const meta = {
            disabled: {
                'someEntry.someFlag': true,
                'someEntry.someOtherFlag': true,
                'someOtherEntry.someFlag': true,
                'someOtherEntry.someOtherFlag': true,
            },
        };

        const columns = getTwoColumns();
        const rows = getTwoRows();
        const { getByDataQa } = render(
            getCheckboxTable({ ...defaultProps, data, meta, columns, rows, onChange: changeHandler })
        );
        const rowCheckbox = getByDataQa(`checkbox-someId-select-all-column-header`) as HTMLInputElement;
        expect(rowCheckbox.checked).toBeFalsy();
    });

    it(`should mark 'all-checked' as checked when all it's editable values are checked`, () => {
        const changeHandler = jest.fn();
        const data = getAllTrueData();

        data.someEntry.someFlag = false;
        const meta = {
            disabled: {
                'someEntry.someFlag': true,
            },
        };

        const columns = getTwoColumns();
        const rows = getTwoRows();
        const { getByDataQa } = render(
            getCheckboxTable({ ...defaultProps, data, meta, columns, rows, onChange: changeHandler })
        );
        const rowCheckbox = getByDataQa(`checkbox-someId-select-all-column-header`) as HTMLInputElement;
        expect(rowCheckbox.checked).toBeTruthy();
    });
});
