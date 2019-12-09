import * as React from 'react';

import { Option } from '@ampel-ui/api';

import { Select } from './select';

import { cleanup, fireEvent, render } from '@config/testing';

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

// const changeValue = (node: HTMLElement, value: string) => {
//     fireEvent.change(node, { target: { value } });
// };

const StringSelect = Select as new () => Select<string, Option<string>>;

describe('Select', () => {
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

    it('should render standard select toggle', () => {
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

    it('should invoke `filterBy` function', () => {
        const id = 'my-select';
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const onChange = jest.fn();
        const searchable = true;
        const filterBy = jest.fn();

        render(
            <StringSelect
                id={id}
                options={options}
                onChange={onChange}
                value={''}
                searchable={searchable}
                filterBy={filterBy}
            />
        );

        expect(filterBy).toHaveBeenCalled();
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

    it('should render correct placeholder for standard toggle', () => {
        const id = 'my-select';
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const onChange = jest.fn();
        const placeholder = 'Placeholder';

        const { getByDataQa } = render(
            <StringSelect id={id} options={options} onChange={onChange} value={''} placeholder={placeholder} />
        );
        const toggle = getByDataQa(`select-toggle--standard-text-${id}`);

        expect(toggle.textContent).toEqual(placeholder);
    });

    it('should use selected option label as placeholder', () => {
        const id = 'my-select';
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const onChange = jest.fn();
        const placeholder = 'Placeholder';
        const value = 'one';
        const label = 'One';

        const { getByDataQa } = render(
            <StringSelect id={id} options={options} onChange={onChange} value={value} placeholder={placeholder} />
        );
        const toggle = getByDataQa(`select-toggle--standard-text-${id}`);

        expect(toggle.textContent).toEqual(label);
    });

    // it('should NOT close searchable select on input field click', () => {
    //     const id = 'my-select';
    //     const options = [
    //         { label: 'One', value: 'one' },
    //         { label: 'Two', value: 'two' },
    //         { label: 'Three', value: 'three' },
    //     ];
    //     const onChange = jest.fn();
    //     const searchable = true;
    //     const value = 'one';
    //
    //     const { getByDataQa, queryByDataQa } = render(
    //         <StringSelect id={id} options={options} onChange={onChange} value={value} searchable={searchable} />
    //     );
    //
    //     const searchableSelectToggle = getByDataQa(`select-toggle--search-${id}`);
    //     searchableSelectToggle.click();
    //
    //     const searchInput = getByDataQa(`select-option-toggle--input-${id}`) as HTMLInputElement;
    //     searchInput.click();
    //
    //     const selectOptionsWrapper = queryByDataQa(`select-options-wrapper-${id}`);
    //     expect(selectOptionsWrapper).toBeTruthy();
    // });
});
