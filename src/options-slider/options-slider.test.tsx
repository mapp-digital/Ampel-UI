import * as React from 'react';

import { cleanup, render } from '../../config/testing';

import { OptionsSlider } from './index';

describe('OptionsSlider', () => {
    afterEach(cleanup);

    it('should show a Slider', () => {
        const options = [
            {
                value: '',
                label: '',
            },
            {
                value: '',
                label: '',
            },
        ];
        render(<OptionsSlider id="someId" value={null} options={options} onChange={jest.fn()} />);
    });

    it('should invoke `onChange` when clicking on the label of an option', () => {
        const desiredValue = 'valueToBeSelected';
        const options = [
            {
                value: 'someOtherValue',
                label: 'Some Other Label',
            },
            {
                value: desiredValue,
                label: 'Select Me!',
            },
        ];
        const onChange = jest.fn();
        const { getByDataQa } = render(
            <OptionsSlider id="someId" value={null} options={options} onChange={onChange} />
        );

        const label = getByDataQa(`options-slider--mark-${desiredValue}`);
        label.click();

        expect(onChange).toHaveBeenCalledWith(desiredValue);
    });

    it('should not invoke `onChange` handler when clicking on the label, if `disabled` prop is provided', () => {
        const desiredValue = 'valueToBeSelected';
        const options = [
            {
                value: 'someOtherValue',
                label: 'Some Other Label',
            },
            {
                value: desiredValue,
                label: 'Select Me!',
            },
        ];
        const onChange = jest.fn();
        const disabled = true;

        const { getByDataQa } = render(
            <OptionsSlider id="someId" value={null} options={options} onChange={onChange} disabled={disabled} />
        );

        const label = getByDataQa(`options-slider--mark-${desiredValue}`);
        label.click();

        expect(onChange).not.toHaveBeenCalled();
    });
});
