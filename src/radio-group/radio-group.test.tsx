import * as React from 'react';

import { cleanup, render } from '@config/testing';

import { RadioGroup } from './';

const options = [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }];

describe('RadioGroup', () => {
    afterEach(cleanup);

    it('should render with basic properties', () => {
        const id = 'my-radio';
        const name = 'my-radio-group';
        const onChange = jest.fn();
        const value = 'yes';

        const { getByDataQa } = render(
            <RadioGroup id={id} name={name} onChange={onChange} value={value} options={options} />
        );

        const firstRadio = getByDataQa(`radio-my-radio-0`);
        const secondRadio = getByDataQa(`radio-my-radio-1`);

        expect(firstRadio).toBeTruthy();
        expect(secondRadio).toBeTruthy();
    });

    it('should be checked by default', () => {
        const id = 'my-radio';
        const name = 'my-radio-group';
        const onChange = jest.fn();
        const value = 'yes';

        const { getByDataQa } = render(
            <RadioGroup id={id} name={name} onChange={onChange} value={value} options={options} />
        );

        const firstRadio = getByDataQa(`radio-my-radio-0`) as HTMLInputElement;

        expect(firstRadio.checked).toBe(true);
    });

    it('should invoke method upon radio change', () => {
        const id = 'my-radio';
        const name = 'my-radio-group';
        const onChange = jest.fn();
        const value = 'yes';
        const newValue = 'no';

        const { getByDataQa } = render(
            <RadioGroup id={id} name={name} onChange={onChange} value={value} options={options} />
        );

        const secondRadio = getByDataQa(`radio-my-radio-1`);

        secondRadio.click();

        expect(onChange).toHaveBeenCalledWith(newValue);
    });
});
