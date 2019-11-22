import * as React from 'react';

import { Option } from '@ampel-ui/api';

import { SelectList } from '@ampel-ui/select/select-list';

import { cleanup, render } from '@config/testing';

const StringSelectList = SelectList as new () => SelectList<string, Option<string>>;

// `scrollIntoView` is not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('SelectList', () => {
    afterEach(cleanup);

    it('should render default list', () => {
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const value = 'one';
        const onChange = jest.fn();

        const { getByDataQa } = render(<StringSelectList value={value} options={options} onChange={onChange} />);
        const defaultListNode = getByDataQa(`select-list--default`);

        expect(defaultListNode).toBeTruthy();
    });

    it('should invoke custom renderer function', () => {
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const value = 'one';
        const onChange = jest.fn();
        const renderer = jest.fn();

        render(<StringSelectList value={value} options={options} onChange={onChange} renderer={renderer} />);

        expect(renderer).toHaveBeenCalledTimes(1);
    });

    it('should invoke `onChange` handler upon clicking on option', () => {
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const value = 'one';
        const label = 'One';
        const onChange = jest.fn();

        const { getByDataQa } = render(<StringSelectList value={''} options={options} onChange={onChange} />);
        const listItem = getByDataQa(`select--option-${label}`);

        listItem.click();

        expect(onChange).toHaveBeenCalledWith(value);
    });

    it('should assign `selected` class to the selected item', () => {
        const options = [
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
        ];
        const value = 'one';
        const label = 'One';
        const onChange = jest.fn();

        const { getByDataQa } = render(<StringSelectList value={value} options={options} onChange={onChange} />);
        const listItem = getByDataQa(`select--option-${label}`);

        expect(listItem.classList.contains('selected')).toBeTruthy();
    });
});
