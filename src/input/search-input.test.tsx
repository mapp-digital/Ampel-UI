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
        const searchInput = getByDataQa(`search-input-${id}`);

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
        const searchInput = getByDataQa(`search-input-${id}`);

        const newValue = 'foo';
        fireEvent.change(searchInput, { target: { value: newValue } });

        expect(onFilterChange).toHaveBeenNthCalledWith(1, newValue);
    });

    it('should NOT invoke `onFilterChange` if disabled', () => {
        const id = 'search-input';
        const value = '';
        const searchPlaceholder = 'search';
        const onFilterChange = jest.fn();
        const disabled = true;

        const { getByDataQa } = render(
            <SearchInput
                id={id}
                value={value}
                onFilterChange={onFilterChange}
                searchPlaceholder={searchPlaceholder}
                disabled={disabled}
            />
        );
        const searchInput = getByDataQa(`search-input-${id}`);

        const newValue = 'foo';
        fireEvent.change(searchInput, { target: { value: newValue } });

        expect(onFilterChange).not.toHaveBeenCalled();
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

    it('should not invoke `onFilterChange` upon clicking clear icon if disabled', () => {
        const id = 'search-input';
        const value = 'value';
        const searchPlaceholder = 'search';
        const onFilterChange = jest.fn();
        const disabled = true;

        const { getByDataQa } = render(
            <SearchInput
                id={id}
                value={value}
                onFilterChange={onFilterChange}
                searchPlaceholder={searchPlaceholder}
                disabled={disabled}
            />
        );
        const clearIcon = getByDataQa(`${id}-clear`) as HTMLButtonElement;

        clearIcon.click();

        expect(onFilterChange).not.toHaveBeenCalled();
    });

    it('should invoke `onClick` handler', () => {
        const id = 'search-input';
        const value = '';
        const searchPlaceholder = 'search';
        const onFilterChange = jest.fn();
        const onClick = jest.fn();

        const { getByDataQa } = render(
            <SearchInput
                id={id}
                value={value}
                onFilterChange={onFilterChange}
                searchPlaceholder={searchPlaceholder}
                onClick={onClick}
            />
        );
        const searchInput = getByDataQa(`search-input-${id}`);
        searchInput.click();

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should have autocomplete turned off by default', () => {
        const id = 'search-input';
        const value = '';
        const searchPlaceholder = 'search';
        const onFilterChange = jest.fn();

        const { getByDataQa } = render(
            <SearchInput id={id} value={value} onFilterChange={onFilterChange} searchPlaceholder={searchPlaceholder} />
        );
        const searchInput = getByDataQa(`search-input-${id}`) as HTMLInputElement;

        expect(searchInput.autocomplete).toEqual('off');
    });

    it('should contain passed className', () => {
        const id = 'search-input';
        const value = '';
        const searchPlaceholder = 'search';
        const onFilterChange = jest.fn();
        const className = 'foobar';

        const { getByDataQa } = render(
            <SearchInput
                id={id}
                value={value}
                onFilterChange={onFilterChange}
                searchPlaceholder={searchPlaceholder}
                className={className}
            />
        );
        const searchInput = getByDataQa(`search-input-${id}`);

        expect(searchInput.classList.contains(className)).toBeTruthy();
    });
});
