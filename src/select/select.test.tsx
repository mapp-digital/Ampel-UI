import * as React from 'react';

import { cleanup, fireEvent, render } from '../../config/testing';

import { Option, StringSelect } from './index';

const changeValue = (node: HTMLElement, value: string) => {
    fireEvent.change(node, { target: { value } });
};

afterEach(cleanup);
describe('Select', () => {
    it('should show the configured placeholder if no value given', () => {
        const id = 'someId';
        const options: Array<Option<string>> = [];
        const value = undefined;
        const onChange = jest.fn();
        const placeholder = 'Please select ...';

        const { getByDataQa } = render(
            <StringSelect id={id} value={value} options={options} onChange={onChange} placeholder={placeholder} />
        );
        const selectToggleText = getByDataQa('select--toggle-text-' + id);

        expect(selectToggleText.textContent).toEqual(placeholder);
    });

    it('should show nothing if no value or placeholder given', () => {
        const id = 'someId';
        const options: Array<Option<string>> = [];
        const value = undefined;
        const onChange = jest.fn();

        const { getByDataQa } = render(<StringSelect id={id} value={value} options={options} onChange={onChange} />);
        const selectToggleText = getByDataQa('select--toggle-text-' + id);

        expect(selectToggleText.textContent).toEqual('');
    });

    it('should invoke the changeHandler when option is selected', () => {
        const id = 'someId';
        const label = 'Egon';
        const value = 'egon';
        const options: Array<Option<string>> = [{ label, value }, { label: 'Peter', value: '_Pete01' }];
        const noValue = undefined;
        const onChange = jest.fn();

        const { getByDataQa } = render(<StringSelect id={id} value={noValue} options={options} onChange={onChange} />);

        const toggle = getByDataQa('select--toggle-' + id);
        toggle.click();

        const desiredOption = getByDataQa('select--option-' + label);
        desiredOption.click();

        expect(onChange).toHaveBeenNthCalledWith(1, value);
    });

    it('should not invoke the changeHandler when initial option is selected', () => {
        const id = 'someId';
        const label = 'Egon';
        const value = 'egon';
        const options: Array<Option<string>> = [{ label, value }, { label: 'Peter', value: '_Pete01' }];
        const onChange = jest.fn();

        const { getByDataQa } = render(<StringSelect id={id} value={value} options={options} onChange={onChange} />);

        const toggle = getByDataQa('select--toggle-' + id);
        toggle.click();

        const desiredOption = getByDataQa('select--option-' + label);
        desiredOption.click();

        expect(onChange).not.toHaveBeenCalled();
    });

    it('should not invoke the changeHandler when initial option is selected', () => {
        const id = 'someId';
        const initialOptionLabel = 'Egon';
        const value = 'egon';
        const options: Array<Option<string>> = [
            { label: initialOptionLabel, value },
            { label: 'Peter', value: '_Pete01' },
        ];
        const onChange = jest.fn();
        const { getByDataQa } = render(<StringSelect id={id} value={value} options={options} onChange={onChange} />);
        const toggle = getByDataQa('select--toggle-' + id);
        toggle.click();

        const desiredOption = getByDataQa('select--option-' + initialOptionLabel);
        desiredOption.click();

        expect(onChange).not.toHaveBeenCalled();
    });

    it('should close on escape key pressed', () => {
        const id = 'someId';
        const options: Array<Option<string>> = [{ label: 'Egon', value: 'egon' }];
        const { getByDataQa, queryByDataQa } = render(
            <StringSelect id={id} value={'egon'} options={options} onChange={jest.fn()} />
        );
        const toggle = getByDataQa('select--toggle-' + id);
        toggle.click();

        fireEvent.keyDown(toggle, { keyCode: 27 });

        const optionItems = queryByDataQa('select--option-items-' + id);
        expect(optionItems).toBeFalsy();
    });

    it('should not close on other key pressed', () => {
        const id = 'someId';
        const options: Array<Option<string>> = [{ label: 'Egon', value: 'egon' }];
        const { getByDataQa } = render(<StringSelect id={id} value={'egon'} options={options} onChange={jest.fn()} />);
        const toggle = getByDataQa('select--toggle-' + id);
        toggle.click();

        fireEvent.keyDown(toggle, { keyCode: 13 });

        const optionItems = getByDataQa('select--option-items-' + id);
        expect(optionItems).toBeTruthy();
    });

    it('should close on outer click', () => {
        const listeners = hijackEventListeners();
        const id = 'someId';
        const options: Array<Option<string>> = [{ label: 'Egon', value: 'egon' }];
        const { getByDataQa, queryByDataQa } = render(
            <div>
                <div data-qa="outer">outer</div>
                <StringSelect id={id} value={'egon'} options={options} onChange={jest.fn()} />
            </div>
        );
        const toggle = getByDataQa('select--toggle-' + id);
        toggle.click();

        const outer = getByDataQa('outer');
        listeners.mousedown({ target: outer });

        const optionItems = queryByDataQa('select--option-items-' + id);
        expect(optionItems).toBeFalsy();
        listeners._reset();
    });

    it('should render filter correctly', () => {
        const id = 'someId';
        const options: Array<Option<string>> = [];
        const { getByDataQa } = render(<StringSelect searchable={true} id={id} options={options} onChange={jest.fn()} />);
        const toggle = getByDataQa('select--toggle-' + id);
        toggle.click();

        const searchInput = getByDataQa('select--filter-' + id);
        expect(searchInput).toBeTruthy();
    });

    it('should filter items correctly', () => {
        const id = 'someId';
        const options: Array<Option<string>> = [{ label: 'John', value: 'john' }, { label: 'Arya', value: 'arya' }];
        const { getByDataQa } = render(<StringSelect searchable={true} id={id} options={options} onChange={jest.fn()} />);
        const toggle = getByDataQa('select--toggle-' + id);
        toggle.click();

        const searchInput = getByDataQa('select--filter-' + id) as HTMLInputElement;
        changeValue(searchInput, 'bc');

        const optionItems = getByDataQa('select--option-items-' + id);
        expect(optionItems.children.length).toBe(0);

        changeValue(searchInput, 'jo');
        expect(optionItems.children.length).toBe(1);

        changeValue(searchInput, 'jos');
        expect(optionItems.children.length).toBe(0);
    });

    it('should have disabled class when disabled', () => {
        const id = 'someId';
        const disabled = true;
        const { getByDataQa } = render(<StringSelect id={id} disabled={disabled} options={[]} onChange={jest.fn()} />);
        const toggle = getByDataQa('select--toggle-' + id);
        expect(toggle.classList.contains('disabled')).toBeTruthy();
    });

    it('should NOT have disabled class when NOT disabled', () => {
        const id = 'someId';
        const disabled = false;
        const { getByDataQa } = render(<StringSelect id={id} disabled={disabled} options={[]} onChange={jest.fn()} />);
        const toggle = getByDataQa('select--toggle-' + id);
        expect(toggle.classList.contains('disabled')).toBeFalsy();
    });

    it('should not expand options when disabled', () => {
        const id = 'someId';
        const disabled = true;
        const options: Array<Option<string>> = [{ label: 'Egon', value: 'egon' }];
        const { getByDataQa, queryByDataQa } = render(<StringSelect id={id} disabled={disabled} options={options} onChange={jest.fn()} />);
        const toggle = getByDataQa('select--toggle-' + id);
        toggle.click();

        const optionItems = queryByDataQa('select--option-items-' + id);
        expect(optionItems).toBeFalsy();
    });
});

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
