import * as React from 'react';

import { cleanup, render } from '../../config/testing';

import { Checkbox } from './index';

describe('Checkbox', () => {
    afterEach(cleanup);

    it('should render with id', () => {
        const id = 'the-checkbox';
        const { getByDataQa } = render(<Checkbox id={id} onChange={jest.fn()} value={false} />);
        const checkbox = getByDataQa(`checkbox-${id}`);
        expect(checkbox).toBeTruthy();
    });

    it('should invoke change method upon clicking', () => {
        const id = 'the-checkbox';
        const onChange = jest.fn();
        const { getByDataQa } = render(<Checkbox id={id} onChange={onChange} value={false} />);
        const checkbox = getByDataQa(`checkbox-${id}`);
        checkbox.click();

        expect(onChange).toBeCalledWith(true);
    });

    it('should apply initially passed value', () => {
        const id = 'the-checkbox';
        const onChange = jest.fn();
        const { getByDataQa } = render(<Checkbox id={id} onChange={onChange} value={true} />);
        const checkbox = getByDataQa(`checkbox-${id}`) as HTMLInputElement;
        expect(checkbox.checked).toBeTruthy();
    });

    it('should be assignable to a label element', () => {
        const id = 'the-checkbox';
        const labelText = 'Some Label';
        const onChange = jest.fn();
        const { getByText } = render(
            <div>
                <label htmlFor={id}>{labelText}</label>
                <Checkbox id={id} onChange={onChange} value={true} />
            </div>
        );
        const label = getByText(labelText);
        label.click();

        expect(onChange).toBeCalledWith(false);
    });

    it('should be disabled', () => {
        const id = 'the-checkbox';
        const { getByDataQa } = render(<Checkbox id={id} onChange={jest.fn()} value={true} disabled={true} />);
        const checkbox = getByDataQa(`checkbox-${id}`) as HTMLInputElement;
        expect(checkbox.disabled).toBeTruthy();
    });
});
