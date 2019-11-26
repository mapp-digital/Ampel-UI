import { fireEvent } from 'dom-testing-library';
import * as React from 'react';

import { Option } from '@ampel-ui/api';

import { Select } from './select';

import { cleanup, render } from '@config/testing';

const hijackEventListeners = () => {
    const initialAddEventListener = document.addEventListener;
    const listeners: any = {};
    document.addEventListener = jest.fn((event, cb) => {
        listeners[event] = cb;
    });

    listeners._reset = () => {
        document.addEventListener = initialAddEventListener;
    };

    return listeners;
};

const changeValue = (node: HTMLElement, value: string) => {
    fireEvent.change(node, { target: { value } });
};

const StringSelect = Select as new () => Select<string, Option<string>>;

describe('Select2', () => {
    afterEach(cleanup);

    it('should exist', () => {
        const id = 'my-select';
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const onChange = jest.fn();

        const { getByDataQa } = render(<StringSelect id={id} options={options} onChange={onChange} value={''} />);
        const select = getByDataQa(`select-component-${id}`);

        expect(select).toBeTruthy();
    });

    it('should render standar select toggle', () => {
        const id = 'my-select';
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const onChange = jest.fn();

        const { getByDataQa } = render(<StringSelect id={id} options={options} onChange={onChange} value={''} />);
        const standardSelectToggle = getByDataQa(`select-toggle--standard-${id}`);

        expect(standardSelectToggle).toBeTruthy();
    });

    it('should render searchable select toggle', () => {
        const id = 'my-select';
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const onChange = jest.fn();
        const searchable = true;

        const { getByDataQa } = render(
            <StringSelect id={id} options={options} onChange={onChange} value={''} searchable={searchable} />
        );
        const searchableSelectToggle = getByDataQa(`select-toggle--search-${id}`);

        expect(searchableSelectToggle).toBeTruthy();
    });

    it('should close on escape key pressed', () => {
        const id = 'my-select';
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const onChange = jest.fn();

        const { getByDataQa, queryByDataQa } = render(
            <StringSelect id={id} options={options} onChange={onChange} value={''} />
        );

        const standardSelectToggle = getByDataQa(`select-toggle--standard-${id}`);
        standardSelectToggle.click();

        fireEvent.keyDown(standardSelectToggle, { keyCode: 27 });

        const selectOptionsWrapper = queryByDataQa(`select-options-wrapper-${id}`);
        expect(selectOptionsWrapper).toBeFalsy();
    });

    it('should NOT close on other key press', () => {
        const id = 'my-select';
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const onChange = jest.fn();

        const { getByDataQa, queryByDataQa } = render(
            <StringSelect id={id} options={options} onChange={onChange} value={''} />
        );

        const standardSelectToggle = getByDataQa(`select-toggle--standard-${id}`);
        standardSelectToggle.click();

        fireEvent.keyDown(standardSelectToggle, { keyCode: 13 });

        const selectOptionsWrapper = queryByDataQa(`select-options-wrapper-${id}`);
        expect(selectOptionsWrapper).toBeTruthy();
    });

    it('should close on outer click', () => {
        const id = 'my-select';
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const onChange = jest.fn();
        const listeners = hijackEventListeners();

        const { getByDataQa, queryByDataQa } = render(
            <div>
                <div data-qa="outer">outer</div>
                <StringSelect id={id} options={options} onChange={onChange} value={''} />
            </div>
        );

        const standardSelectToggle = getByDataQa(`select-toggle--standard-${id}`);
        standardSelectToggle.click();

        const outer = getByDataQa('outer');
        listeners.mousedown({ target: outer });

        const selectOptionsWrapper = queryByDataQa(`select-options-wrapper-${id}`);
        expect(selectOptionsWrapper).toBeFalsy();

        listeners._reset();
    });

    it('should NOT expand select if disabled', () => {
        const id = 'my-select';
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const onChange = jest.fn();
        const disabled = true;

        const { getByDataQa, queryByDataQa } = render(
            <StringSelect id={id} options={options} onChange={onChange} value={''} disabled={disabled} />
        );

        const standardSelectToggle = getByDataQa(`select-toggle--standard-${id}`);
        standardSelectToggle.click();

        const selectOptionsWrapper = queryByDataQa(`select-options-wrapper-${id}`);
        expect(selectOptionsWrapper).toBeFalsy();
    });

    it('should clear search input value upon clicking X', () => {
        const id = 'my-select';
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const onChange = jest.fn();
        const searchable = true;

        const { getByDataQa } = render(
            <StringSelect id={id} options={options} onChange={onChange} value={''} searchable={searchable} />
        );

        const searchInput = getByDataQa(`select-option-toggle--input-${id}`) as HTMLInputElement;
        changeValue(searchInput, 'abc');

        const clearSearch = getByDataQa(`select-option-toggle--clear-${id}`);
        clearSearch.click();

        expect(searchInput.value).toBe('');
    });
});
