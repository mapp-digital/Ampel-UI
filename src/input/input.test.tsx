import * as React from 'react';

import { cleanup, fireEvent, render } from '../../config/testing';

import { Input } from './index';

const changeValue = (node: HTMLElement, value: string) => {
    fireEvent.change(node, { target: { value } });
};

const emitBlur = (node: HTMLElement) => {
    fireEvent.blur(node);
};

describe('Input', () => {
    afterEach(cleanup);

    it('should show a passed value and handle changes', () => {
        const id = 'theInput';
        const value = 'someInputValue';
        const valueSetter = jest.fn();

        const { getByDataQa } = render(<Input id={id} value={value} onChange={valueSetter} />);

        const input = getByDataQa('input--element-' + id) as HTMLInputElement;
        expect(input.value).toEqual(value);

        const someOtherValue = 'someOtherValue';
        changeValue(input, someOtherValue);

        expect(valueSetter).toHaveBeenNthCalledWith(1, someOtherValue);
    });

    it('should show an prepend text if provided', () => {
        const id = 'theInput';
        const prepend = 'This should be prepended';

        const { getByDataQa } = render(<Input id={id} value="someInputValue" onChange={jest.fn()} prepend={prepend} />);

        const text = getByDataQa('input--prepend').textContent;
        expect(text).toEqual(prepend);
    });

    it('should show an append text if provided', () => {
        const id = 'theInput';
        const append = 'This should be appended';

        const { getByDataQa } = render(<Input id={id} value="someInputValue" onChange={jest.fn()} append={append} />);

        const text = getByDataQa('input--append').textContent;
        expect(text).toEqual(append);
    });

    it('should invoke onBlur handler', () => {
        const id = 'theInput';
        const onBlur = jest.fn();
        const { getByDataQa } = render(<Input id={id} value="someInputValue" onChange={jest.fn()} onBlur={onBlur} />);
        const input = getByDataQa('input--element-' + id) as HTMLInputElement;

        emitBlur(input);

        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should show a placeholder', () => {
        const id = 'theInput';
        const placeholder = 'Some valuable information';
        const { getByDataQa } = render(
            <Input id={id} value="someInputValue" onChange={jest.fn()} placeholder={placeholder} />
        );

        const input = getByDataQa('input--element-' + id) as HTMLInputElement;

        expect(input.placeholder).toEqual(placeholder);
    });
});
