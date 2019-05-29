import * as React from 'react';

import { cleanup, fireEvent, render } from '@config/testing';

import { PageEvent, Table } from './';

describe('Table', () => {
    afterEach(cleanup);

    it('should exist', () => {
        const id = 'someId';
        const { queryByDataQa } = render(<Table id={id} data={[]} columns={[]} ofText="" pageText="" />);
        const table = queryByDataQa(`table-${id}`);
        expect(table).toBeTruthy();
    });

    it('should have contents accessible', () => {
        const id = 'someId';
        const name = 'Name 3';
        const data = [
            {
                name: 'Name 1',
            },
            {
                name: 'Name 2',
            },
            {
                name,
            },
        ];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
            },
        ];
        const { getByDataQa } = render(<Table id={id} data={data} columns={columns} ofText="" pageText="" />);
        const cell = getByDataQa(`table--row-2-col-name`);
        expect(cell.textContent).toEqual(name);
    });

    it('should sort table initially according to provided rule', () => {
        const id = 'someId';
        const name = 'Name 3';
        const data = [
            {
                name: 'Name 1',
            },
            {
                name: 'Name 2',
            },
            {
                name,
            },
        ];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
            },
        ];
        const initiallySortBy: Array<any> = [
            {
                column: 'name',
                direction: 'desc',
            },
        ];

        const { getByDataQa } = render(
            <Table id={id} data={data} columns={columns} ofText="" pageText="" initiallySortBy={initiallySortBy} />
        );

        const cell = getByDataQa(`table--row-0-col-name`);
        expect(cell.textContent).toEqual(name);
    });

    it('should sort table initially according to multiple provided rules', () => {
        const id = 'someId';
        const name = 'Name 3';
        const age = '20';
        const data = [
            {
                name: 'Name 1',
                age: '56',
            },
            {
                name: 'Name 2',
                age: '34',
            },
            {
                name,
                age,
            },
        ];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
            },
            {
                id: 'age',
                Header: 'Age',
            },
        ];
        const initiallySortBy: Array<any> = [
            {
                column: 'name',
                direction: 'desc',
            },
            {
                column: 'age',
                direction: 'asc',
            },
        ];

        const { getByDataQa } = render(
            <Table id={id} data={data} columns={columns} ofText="" pageText="" initiallySortBy={initiallySortBy} />
        );

        const nameCell = getByDataQa(`table--row-0-col-name`);
        expect(nameCell.textContent).toEqual(name);

        const ageCell = getByDataQa(`table--row-0-col-age`);
        expect(ageCell.textContent).toEqual(age);
    });

    it('should render multi value content', () => {
        const id = 'someId';
        const nameList = ['Name 3', 'Name 4', 'Name 5'];
        const data = [
            {
                name: 'Name 1',
            },
            {
                name: 'Name 2',
            },
            {
                name: nameList,
            },
        ];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
            },
        ];
        const { getByDataQa } = render(<Table id={id} data={data} columns={columns} ofText="" pageText="" />);
        const cell = getByDataQa(`table--row-2-col-name`);
        expect(cell.textContent).toEqual('Name 3, Name 4, Name 5');
    });

    it('should have a search bar', () => {
        const { queryByDataQa } = render(<Table id={'someId'} data={[]} columns={[]} ofText="" pageText="" />);
        const searchBar = queryByDataQa(`table--search-bar`);
        expect(searchBar).toBeTruthy();
    });

    it('should filter the values corresponding to the search bar value', () => {
        const id = 'someId';
        const nameList = ['Name 3', 'Name 4', 'Name 5'];
        const data = [
            {
                name: 'Name 1',
            },
            {
                name: 'Name 2',
            },
            {
                name: nameList,
            },
        ];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
            },
        ];
        const { getByDataQa } = render(<Table id={id} data={data} columns={columns} ofText="" pageText="" />);
        const searchBar = getByDataQa(`table--search-bar`);
        fireEvent.change(searchBar, { target: { value: '2' } });

        const cell = getByDataQa(`table--row-0-col-name`);
        expect(cell.textContent).toEqual('Name 2');
    });

    it('should render actions', () => {
        const id = 'someId';
        const secondEntry = {
            name: 'Name 2',
        };
        const data = [
            {
                name: 'Name 1',
            },
            secondEntry,
            {
                name: 'Name 3',
            },
        ];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
            },
        ];
        const onClick = jest.fn();
        const columnActions = {
            Header: 'Actions',
            actions: [
                {
                    id: 'add',
                    onClick,
                    iconClass: 'add',
                },
            ],
        };
        const { getByDataQa } = render(
            <Table id={id} data={data} columns={columns} columnActions={columnActions} ofText="" pageText="" />
        );

        const addButton = getByDataQa(`table--row-1-col-_actions--add`);
        addButton.click();
        expect(onClick).toHaveBeenCalledWith(secondEntry);
    });

    it('should use hidden for actions', () => {
        const id = 'someId';
        const data = [
            {
                name: 'Name 1',
            },
        ];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
            },
        ];
        const onClick = jest.fn();
        const columnActions = {
            Header: 'Actions',
            actions: [
                {
                    id: 'add',
                    onClick,
                    hidden: true,
                    iconClass: 'add',
                },
            ],
        };
        const { getByDataQa } = render(
            <Table id={id} data={data} columns={columns} columnActions={columnActions} ofText="" pageText="" />
        );

        const addButton = getByDataQa(`table--row-0-col-_actions--add`);

        expect(addButton.classList.contains('invisible')).toBeTruthy();
    });

    it('should use hidden for actions', () => {
        const id = 'someId';
        const firstRow = {
            name: 'Name 1',
        };
        const data = [firstRow];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
            },
        ];
        const hiddenStrategy = jest.fn().mockReturnValue(true);
        const columnActions = {
            Header: 'Actions',
            actions: [
                {
                    id: 'add',
                    onClick: jest.fn(),
                    hidden: hiddenStrategy,
                    iconClass: 'add',
                },
            ],
        };
        const { getByDataQa } = render(
            <Table id={id} data={data} columns={columns} columnActions={columnActions} ofText="" pageText="" />
        );

        const addButton = getByDataQa(`table--row-0-col-_actions--add`);

        expect(hiddenStrategy).toHaveBeenCalledWith(firstRow);
        expect(addButton.classList.contains('invisible')).toBeTruthy();
    });

    it('should use disabled for actions', () => {
        const id = 'someId';
        const firstRow = {
            name: 'Name 1',
        };
        const data = [firstRow];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
            },
        ];
        const disabledStrategy = jest.fn().mockReturnValue(true);
        const columnActions = {
            Header: 'Actions',
            actions: [
                {
                    id: 'add',
                    onClick: jest.fn(),
                    disabled: disabledStrategy,
                    iconClass: 'add',
                },
            ],
        };
        const { getByDataQa } = render(
            <Table id={id} data={data} columns={columns} columnActions={columnActions} ofText="" pageText="" />
        );

        const addButton = getByDataQa(`table--row-0-col-_actions--add`) as HTMLButtonElement;

        expect(disabledStrategy).toHaveBeenCalledWith(firstRow);
        expect(addButton.disabled).toBeTruthy();
    });

    it('should have pagination with buttons', () => {
        const name1 = 'Name 1';
        const name2 = 'Name 2';
        const name3 = 'Name 3';
        const data = [
            {
                name: name1,
            },
            {
                name: name2,
            },
            {
                name: name3,
            },
        ];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
            },
        ];
        const { getByDataQa } = render(
            <Table id={'someId'} data={data} columns={columns} pageSize={1} ofText="" pageText="" />
        );

        const clickPaginationButton = (id: string) => {
            const paginationButton = getByDataQa(`table-pagination--${id}`);
            paginationButton.click();
        };

        const expectSingleCellToEqual = (text: string, index: number) => {
            const cell = getByDataQa(`table--row-${index}-col-name`);
            expect(cell.textContent).toEqual(text);
        };

        clickPaginationButton('last');
        expectSingleCellToEqual(name3, 0);

        clickPaginationButton('previous');
        expectSingleCellToEqual(name2, 0);

        clickPaginationButton('first');
        expectSingleCellToEqual(name1, 0);

        clickPaginationButton('next');
        expectSingleCellToEqual(name2, 0);
    });

    it('should invoke `onPaginate` handler', () => {
        const name1 = 'Name 1';
        const name2 = 'Name 2';
        const name3 = 'Name 3';
        const data = [
            {
                name: name1,
            },
            {
                name: name2,
            },
            {
                name: name3,
            },
        ];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
            },
        ];
        const onPaginate = jest.fn();

        const { getByDataQa } = render(
            <Table id={'someId'} data={data} columns={columns} pageSize={1} ofText="" pageText="" onPaginate={onPaginate} />
        );

        const clickPaginationButton = (id: string) => {
            const paginationButton = getByDataQa(`table-pagination--${id}`);
            paginationButton.click();
        };

        clickPaginationButton('last');
        expect(onPaginate).toHaveBeenCalledWith( PageEvent.LAST, undefined);

        clickPaginationButton('previous');
        expect(onPaginate).toHaveBeenCalledWith( PageEvent.PREVIOUS, undefined);

        clickPaginationButton('first');
        expect(onPaginate).toHaveBeenCalledWith( PageEvent.FIRST, undefined);

        clickPaginationButton('next');
        expect(onPaginate).toHaveBeenCalledWith( PageEvent.NEXT, undefined);
    });

    it('should have pagination with input', () => {
        const name2 = 'Name 2';
        const data = [
            {
                name: 'Name 1',
            },
            {
                name: name2,
            },
            {
                name: 'Name 3',
            },
        ];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
            },
        ];
        const { getByDataQa } = render(
            <Table id={'someId'} data={data} columns={columns} pageSize={1} ofText="" pageText="" />
        );

        const paginationInput = getByDataQa(`table-pagination--page-spin`);
        fireEvent.change(paginationInput, { target: { value: 2 } });
        const cell = getByDataQa(`table--row-${0}-col-name`);
        expect(cell.textContent).toEqual(name2);
    });

    it('should have no paging if elastic - pageSize equals number data count', () => {
        const name2 = 'Name 2';
        const data = [
            {
                name: 'Name 1',
            },
            {
                name: name2,
            },
            {
                name: 'Name 3',
            },
        ];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
            },
        ];
        const { queryByDataQa } = render(
            <Table id={'someId'} data={data} elastic={true} columns={columns} pageSize={1} ofText="" pageText="" />
        );

        const rows = queryByDataQa(`table-pagination--rows`);
        const pager = queryByDataQa(`table-pagination--next`);
        const pageSpin = queryByDataQa(`table-pagination--page-spin`);
        const cell = queryByDataQa(`table--row-1-col-name`);

        expect(rows).toBeFalsy();
        expect(pager).toBeFalsy();
        expect(pageSpin).toBeFalsy();
        expect(cell).toBeTruthy();
        expect(cell!.textContent).toEqual(name2);
    });

    it('should have a column API for rendering a cell', () => {
        const name2 = 'Name 2';
        const data = [
            {
                name: 'Name 1',
            },
            {
                name: name2,
            },
            {
                name: 'Name 3',
            },
        ];
        const dataQa = 'someFancyValue';
        const columns = [
            {
                id: 'name',
                Header: 'Name',
                renderCell: (cellContext: any) => (
                    <div data-qa={`${dataQa}-${cellContext.index}`}>{cellContext.value}</div>
                ),
            },
        ];
        const { getByDataQa } = render(<Table id={'someId'} data={data} columns={columns} ofText="" pageText="" />);

        const customCell = getByDataQa(`${dataQa}-1`);
        expect(customCell.textContent).toEqual(name2);
    });

    it('should have a column API for rendering header', () => {
        const header = 'Header';
        const data = [
            {
                name: 'Name 1',
            },
            {
                name: 'Name 2',
            },
            {
                name: 'Name 3',
            }
        ];
        const columns = [
            {
                id: 'name',
                Header: 'Name',
                renderHeader: () => (
                    <div data-qa="header">{header}</div>
                ),
            },
        ];
        const { getByDataQa } = render(<Table id={'someId'} data={data} columns={columns} ofText="" pageText="" />);

        const customHeader = getByDataQa('header');

        expect(customHeader).toBeTruthy();
        expect(customHeader.textContent).toEqual(header);
    });
});
