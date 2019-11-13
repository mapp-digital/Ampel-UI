import * as React from 'react';

import { cleanup, fireEvent, render } from '@config/testing';

import { SearchInput } from './search-input';

describe('SearchInput', () => {
    afterEach(cleanup);

    it('should exist', () => {
        const id = 'search-input';
        const value = '';
        const searchPlaceholder = 'search';
        const onFilterChange = jest.fn();

        const { getByDataQa } = render(
            <SearchInput id={id} value={value} onFilterChange={onFilterChange} searchPlaceholder={searchPlaceholder} />
        );
        const searchInput = getByDataQa(id);

        expect(searchInput).toBeTruthy();
    });

    it('should invoke `onFilterChange` handler', () => {
        const id = 'search-input';
        const value = '';
        const searchPlaceholder = 'search';
        const onFilterChange = jest.fn();

        const { getByDataQa } = render(
            <SearchInput id={id} value={value} onFilterChange={onFilterChange} searchPlaceholder={searchPlaceholder} />
        );
        const searchInput = getByDataQa(id);

        const newValue = 'foo';
        fireEvent.change(searchInput, { target: { value: newValue } });

        expect(onFilterChange).toHaveBeenNthCalledWith(1, newValue);
    });

    it('should have clear icon disabled if input does not have value', () => {
        const id = 'search-input';
        const value = '';
        const searchPlaceholder = 'search';
        const onFilterChange = jest.fn();

        const { getByDataQa } = render(
            <SearchInput id={id} value={value} onFilterChange={onFilterChange} searchPlaceholder={searchPlaceholder} />
        );
        const clearIcon = getByDataQa(`${id}-clear`) as HTMLButtonElement;

        expect(clearIcon.disabled).toBe(true);
    });

    it('should invoke `onFilterChange` with empty value on clear icon click', () => {
        const id = 'search-input';
        const value = 'value';
        const searchPlaceholder = 'search';
        const onFilterChange = jest.fn();

        const { getByDataQa } = render(
            <SearchInput id={id} value={value} onFilterChange={onFilterChange} searchPlaceholder={searchPlaceholder} />
        );
        const clearIcon = getByDataQa(`${id}-clear`) as HTMLButtonElement;

        clearIcon.click();

        expect(onFilterChange).toHaveBeenNthCalledWith(1, '');
    });
});
