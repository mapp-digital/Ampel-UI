import * as React from 'react';

import { cleanup, fireEvent, render } from '../../config/testing';

import { TwoBoxMultiselect } from './index';

describe('TwoBoxMultiselect', () => {
    afterEach(cleanup);

    it('should exist', () => {
        const id = 'someId';
        const { queryByDataQa } = render(
            <TwoBoxMultiselect id={id} options={[]} labelLeft={''} labelRight={''} values={[]} onChange={jest.fn()} />
        );
        const twoBoxSelect = queryByDataQa(`two-box-multiselect-${id}`);

        expect(twoBoxSelect).toBeTruthy();
    });

    it('should have two boxes and a control panel', () => {
        const id = 'someId';
        const { queryByDataQa } = render(
            <TwoBoxMultiselect id={id} labelLeft={''} labelRight={''} options={[]} values={[]} onChange={jest.fn()} />
        );

        const twoBoxSelectLeft = queryByDataQa(`two-box-multiselect--left-${id}`);
        const twoBoxSelectRight = queryByDataQa(`two-box-multiselect--right-${id}`);
        const twoBoxSelectControl = queryByDataQa(`two-box-multiselect--control-${id}`);

        expect(twoBoxSelectLeft).toBeTruthy();
        expect(twoBoxSelectRight).toBeTruthy();
        expect(twoBoxSelectControl).toBeTruthy();
    });

    it('should labels for both boxes', () => {
        const id = 'someId';
        const labelLeft = 'Label Left';
        const labelRight = 'Label right';
        const { queryByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={labelLeft}
                labelRight={labelRight}
                options={[]}
                values={[]}
                onChange={jest.fn()}
            />
        );

        const twoBoxLabelLeft = queryByDataQa(`two-box-multiselect--left-label-${id}`);
        const twoBoxLabelRight = queryByDataQa(`two-box-multiselect--right-label-${id}`);

        expect(twoBoxLabelLeft).toBeTruthy();
        expect(twoBoxLabelLeft!.textContent).toEqual(labelLeft);
        expect(twoBoxLabelRight).toBeTruthy();
        expect(twoBoxLabelRight!.textContent).toEqual(labelRight);
    });

    it('should render given items for the left side', () => {
        const id = 'someId';
        const value = 'someValue';
        const label = 'Some Label';
        const leftItems = [
            {
                value,
                label,
            },
        ];
        const { queryByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[]}
                onChange={jest.fn()}
            />
        );

        const leftBoxItem = queryByDataQa(`two-box-multiselect--left-item-${value}`);

        expect(leftBoxItem).toBeTruthy();
        expect(leftBoxItem!.textContent).toEqual(label);
    });

    it('should render given items for the right side', () => {
        const id = 'someId';
        const value = 'someValue';
        const label = 'Some Label';
        const leftItems = [
            {
                value,
                label,
            },
        ];
        const { queryByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[value]}
                onChange={jest.fn()}
            />
        );

        const rightBoxItem = queryByDataQa(`two-box-multiselect--right-item-${value}`);

        expect(rightBoxItem).toBeTruthy();
        expect(rightBoxItem!.textContent).toEqual(label);
    });

    it('should exclude passed values from the left side', () => {
        const id = 'someId';
        const value = 'someValue';
        const someOtherValue = 'someOtherValue';
        const label = 'Some Label';
        const leftItems = [
            {
                value,
                label,
            },
            {
                value: someOtherValue,
                label: 'Some other Label',
            },
        ];
        const { queryByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[value]}
                onChange={jest.fn()}
            />
        );

        const leftBoxItem = queryByDataQa(`two-box-multiselect--left-item-${value}`);

        expect(leftBoxItem).toBeFalsy();
    });

    ['left', 'right'].forEach((side) => {
        it(`should highlight ${side.toUpperCase()} item on click and remove on second click`, () => {
            const id = 'someId';
            const value = 'someValue';
            const someOtherValue = 'someOtherValue';
            const leftItems = [
                {
                    value,
                    label: '',
                },
                {
                    value: someOtherValue,
                    label: '',
                },
            ];
            const { getByDataQa } = render(
                <TwoBoxMultiselect
                    id={id}
                    labelLeft={''}
                    labelRight={''}
                    options={leftItems}
                    values={side === 'right' ? [value, someOtherValue] : []}
                    onChange={jest.fn()}
                />
            );

            const someBoxItem = getByDataQa(`two-box-multiselect--${side}-item-${value}`);
            someBoxItem.click();

            const someOtherBoxItem = getByDataQa(`two-box-multiselect--${side}-item-${someOtherValue}`);

            expect(someBoxItem.classList.contains('highlighted')).toBeTruthy();
            expect(someOtherBoxItem.classList.contains('highlighted')).toBeFalsy();

            someBoxItem.click();

            expect(someBoxItem.classList.contains('highlighted')).toBeFalsy();
            expect(someOtherBoxItem.classList.contains('highlighted')).toBeFalsy();
        });

        it(`should NOT highlight ${side.toLocaleUpperCase()} item on click if 'disabled' prop is provided`, () => {
            const id = 'someId';
            const value = 'someValue';
            const someOtherValue = 'someOtherValue';
            const onChange = jest.fn();

            const leftItems = [
                {
                    value,
                    label: '',
                },
                {
                    value: someOtherValue,
                    label: '',
                },
            ];
            const { getByDataQa } = render(
                <TwoBoxMultiselect
                    id={id}
                    labelLeft={''}
                    labelRight={''}
                    options={leftItems}
                    disabled={true}
                    values={side === 'right' ? [value, someOtherValue] : []}
                    onChange={onChange}
                />
            );

            const someBoxItem = getByDataQa(`two-box-multiselect--${side}-item-${value}`);
            someBoxItem.click();

            expect(someBoxItem.classList.contains('highlighted')).toBeFalsy();
        });

        it(`should NOT invoke onChange callback when doubleClicking an ${side.toLocaleUpperCase()} if 'disabled' prop is provided`, () => {
            const id = 'someId';
            const value = 'someValue';
            const someOtherValue = 'someOtherValue';
            const onChange = jest.fn();

            const leftItems = [
                {
                    value,
                    label: '',
                },
                {
                    value: someOtherValue,
                    label: '',
                },
            ];
            const { getByDataQa } = render(
                <TwoBoxMultiselect
                    id={id}
                    labelLeft={''}
                    labelRight={''}
                    options={leftItems}
                    disabled={true}
                    values={side === 'right' ? [value, someOtherValue] : []}
                    onChange={onChange}
                />
            );

            const someBoxItem = getByDataQa(`two-box-multiselect--${side}-item-${value}`);
            fireEvent.doubleClick(someBoxItem);

            expect(onChange).not.toHaveBeenCalled();
        });
    });

    it(`should not show any options if their values are selected`, () => {
        const id = 'someId';
        const value = 'someValue';
        const leftItems = [
            {
                value,
                label: '',
            },
        ];
        const { queryByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[value]}
                onChange={jest.fn()}
            />
        );

        const someLeftBoxItem = queryByDataQa(`two-box-multiselect--left-item-${value}`);

        expect(someLeftBoxItem).toBeFalsy();
    });

    it(`should invoke onChange callback with highlighted left option values when doubleClicking an option`, () => {
        const id = 'someId';
        const value = 'someValue';
        const onChange = jest.fn();
        const leftItems = [
            {
                value,
                label: '',
            },
        ];
        const { getByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[]}
                onChange={onChange}
            />
        );

        const someLeftBoxItem = getByDataQa(`two-box-multiselect--left-item-${value}`);
        fireEvent.doubleClick(someLeftBoxItem);

        expect(onChange).toHaveBeenCalledWith([value]);
    });

    it(`should invoke onChange callback without highlighted right option value when doubleClicking a selected value`, () => {
        const id = 'someId';
        const value = 'someValue';
        const onChange = jest.fn();
        const leftItems = [
            {
                value,
                label: '',
            },
        ];
        const { getByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[value]}
                onChange={onChange}
            />
        );

        const someRightBoxItem = getByDataQa(`two-box-multiselect--right-item-${value}`);
        fireEvent.doubleClick(someRightBoxItem);

        expect(onChange).toHaveBeenCalledWith([]);
    });

    it(`should invoke onChange callback with highlighted left options values when clicking the 'add' button`, () => {
        const id = 'someId';
        const value = 'someValue';
        const onChange = jest.fn();
        const leftItems = [
            {
                value,
                label: '',
            },
        ];
        const { getByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[]}
                onChange={onChange}
            />
        );

        const someLeftBoxItem = getByDataQa(`two-box-multiselect--left-item-${value}`);
        someLeftBoxItem.click();

        const addSingleButton = getByDataQa(`two-box-multiselect--add-highlighted-${id}`);
        addSingleButton.click();

        expect(onChange).toHaveBeenCalledWith([value]);
    });

    it(`should NOT invoke onChange callback when clicking the 'add' button if 'disabled' prop is provided`, () => {
        const id = 'someId';
        const value = 'someValue';
        const onChange = jest.fn();
        const leftItems = [
            {
                value,
                label: '',
            },
        ];
        const { getByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[]}
                disabled={true}
                onChange={onChange}
            />
        );

        const someLeftBoxItem = getByDataQa(`two-box-multiselect--left-item-${value}`);
        someLeftBoxItem.click();

        const addSingleButton = getByDataQa(`two-box-multiselect--add-highlighted-${id}`);
        addSingleButton.click();

        expect(onChange).not.toHaveBeenCalled();
    });

    it(`should invoke onChange callback with all values when clicking the 'addAll' button`, () => {
        const id = 'someId';
        const value = 'someValue';
        const onChange = jest.fn();
        const leftItems = [
            {
                value,
                label: '',
            },
        ];
        const { getByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[]}
                onChange={onChange}
            />
        );

        const addAllButton = getByDataQa(`two-box-multiselect--add-all-${id}`);
        addAllButton.click();

        expect(onChange).toHaveBeenCalledWith([value]);
    });

    it(`should invoke onChange callback with empty collection when clicking 'removeAll' button`, () => {
        const id = 'someId';
        const value = 'someValue';
        const onChange = jest.fn();
        const leftItems = [
            {
                value,
                label: '',
            },
        ];
        const { getByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[value]}
                onChange={onChange}
            />
        );

        const removeAllButton = getByDataQa(`two-box-multiselect--remove-all-${id}`);
        removeAllButton.click();

        expect(onChange).toHaveBeenCalledWith([]);
    });

    it(`should NOT invoke onChange callback when clicking 'addAll/removeAll' button, if 'disabled' prop is provided`, () => {
        const id = 'someId';
        const value = 'someValue';
        const onChange = jest.fn();
        const leftItems = [
            {
                value,
                label: '',
            },
        ];
        const { getByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[value]}
                onChange={onChange}
                disabled={true}
            />
        );

        const addAllButton = getByDataQa(`two-box-multiselect--add-all-${id}`);
        addAllButton.click();

        const removeAllButton = getByDataQa(`two-box-multiselect--remove-all-${id}`);
        removeAllButton.click();

        expect(onChange).not.toHaveBeenCalled();
    });

    it(`should invoke onChange callback with selected highlighted values excluding when clicking 'remove' button`, () => {
        const id = 'someId';
        const value = 'someValue';
        const onChange = jest.fn();
        const someOtherValue = 'someOtherValue';
        const someThirdValue = 'someThirdValue';
        const leftItems = [
            {
                value,
                label: '',
            },
            {
                value: someOtherValue,
                label: '',
            },
            {
                value: someThirdValue,
                label: '',
            },
        ];
        const { getByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[value, someOtherValue, someThirdValue]}
                onChange={onChange}
            />
        );

        const someRightBoxItem = getByDataQa(`two-box-multiselect--right-item-${value}`);
        someRightBoxItem.click();

        const someThirdRightBoxItem = getByDataQa(`two-box-multiselect--right-item-${someThirdValue}`);
        someThirdRightBoxItem.click();

        const removeSingleButton = getByDataQa(`two-box-multiselect--remove-highlighted-${id}`);
        removeSingleButton.click();

        expect(onChange).toHaveBeenCalledWith([someOtherValue]);
    });

    it(`should NOT invoke onChange callback when clicking 'remove' button, if 'disabled' prop is provided`, () => {
        const id = 'someId';
        const value = 'someValue';
        const onChange = jest.fn();
        const someOtherValue = 'someOtherValue';
        const someThirdValue = 'someThirdValue';
        const leftItems = [
            {
                value,
                label: '',
            },
            {
                value: someOtherValue,
                label: '',
            },
            {
                value: someThirdValue,
                label: '',
            },
        ];
        const { getByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[value, someOtherValue, someThirdValue]}
                onChange={onChange}
                disabled={true}
            />
        );

        const someRightBoxItem = getByDataQa(`two-box-multiselect--right-item-${value}`);
        someRightBoxItem.click();

        const someThirdRightBoxItem = getByDataQa(`two-box-multiselect--right-item-${someThirdValue}`);
        someThirdRightBoxItem.click();

        const removeSingleButton = getByDataQa(`two-box-multiselect--remove-highlighted-${id}`);
        removeSingleButton.click();

        expect(onChange).not.toHaveBeenCalled();
    });

    it(`should remove selection after clicking 'remove' or 'removeAll' button`, () => {
        const id = 'someId';
        const value = 'someValue';
        const someOtherValue = 'someOtherValue';
        const leftItems = [
            {
                value,
                label: '',
            },
            {
                value: someOtherValue,
                label: '',
            },
        ];
        const component = (
            <TwoBoxMultiselect
                id={id}
                options={leftItems}
                labelLeft={''}
                labelRight={''}
                values={[value, someOtherValue]}
                onChange={jest.fn()}
            />
        );
        const { getByDataQa, rerender } = render(component);

        const selectItem = () => {
            const someBoxItem = getByDataQa(`two-box-multiselect--right-item-${value}`);
            someBoxItem.click();
        };

        const clickButton = (key: string) => {
            const removeSingleButton = getByDataQa(`two-box-multiselect--${key}-${id}`);
            removeSingleButton.click();
        };

        const resetComponent = () => rerender(component);

        const expectNotHighlighted = () => {
            const someRightBoxItem = getByDataQa(`two-box-multiselect--right-item-${value}`);
            expect(someRightBoxItem.classList.contains('highlighted')).toBeFalsy();
        };

        selectItem();
        clickButton('remove-highlighted');
        resetComponent();
        expectNotHighlighted();

        selectItem();
        clickButton('remove-all');
        resetComponent();
        expectNotHighlighted();
    });

    it(`should remove selection after clicking 'add' or 'addAll' button`, () => {
        const id = 'someId';
        const value = 'someValue';
        const someOtherValue = 'someOtherValue';
        const leftItems = [
            {
                value,
                label: '',
            },
            {
                value: someOtherValue,
                label: '',
            },
        ];
        const component = (
            <TwoBoxMultiselect
                id={id}
                options={leftItems}
                labelLeft={''}
                labelRight={''}
                values={[]}
                onChange={jest.fn()}
            />
        );
        const { getByDataQa, rerender } = render(component);

        const selectItem = () => {
            const someBoxItem = getByDataQa(`two-box-multiselect--left-item-${value}`);
            someBoxItem.click();
        };

        const clickButton = (key: string) => {
            const removeSingleButton = getByDataQa(`two-box-multiselect--${key}-${id}`);
            removeSingleButton.click();
        };

        const resetComponent = () => rerender(component);

        const expectNotHighlighted = () => {
            const someRightBoxItem = getByDataQa(`two-box-multiselect--left-item-${value}`);
            expect(someRightBoxItem.classList.contains('highlighted')).toBeFalsy();
        };

        selectItem();
        clickButton('add-highlighted');
        resetComponent();
        expectNotHighlighted();

        selectItem();
        clickButton('add-all');
        resetComponent();
        expectNotHighlighted();
    });

    it(`should exclude left side options that don't fit to the current filter`, () => {
        const id = 'someId';
        const value = 'someValue';
        const leftItems = [
            {
                value,
                label: 'Some fancy Label',
            },
        ];
        const { getByDataQa, queryByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[]}
                onChange={jest.fn()}
            />
        );

        const leftOptionsFilter = getByDataQa(`two-box-multiselect--left-filter-${id}`);
        changeValue(leftOptionsFilter, 'no label like this');

        const absentLeftItem = queryByDataQa(`two-box-multiselect--left-item-${value}`);

        expect(absentLeftItem).toBeFalsy();
    });

    it(`should exclude right side options that don't fit to the current filter`, () => {
        const id = 'someId';
        const value = 'someValue';
        const leftItems = [
            {
                value,
                label: 'Some fancy Label',
            },
        ];
        const { getByDataQa, queryByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                labelLeft={''}
                labelRight={''}
                options={leftItems}
                values={[value]}
                onChange={jest.fn()}
            />
        );

        const rightOptionsFilter = getByDataQa(`two-box-multiselect--right-filter-${id}`);
        changeValue(rightOptionsFilter, 'no label like this');

        const absentRightItem = queryByDataQa(`two-box-multiselect--right-item-${value}`);

        expect(absentRightItem).toBeFalsy();
    });

    it(`should show placeholder for filter bar if configured`, () => {
        const id = 'someId';
        const filterPlaceholderLeft = 'searchLeft';
        const filterPlaceholderRight = 'searchRight';
        const { getByDataQa } = render(
            <TwoBoxMultiselect
                id={id}
                filterPlaceholderLeft={filterPlaceholderLeft}
                filterPlaceholderRight={filterPlaceholderRight}
                labelLeft={''}
                labelRight={''}
                options={[]}
                values={[]}
                onChange={jest.fn()}
            />
        );

        const leftOptionsFilter = getByDataQa(`two-box-multiselect--left-filter-${id}`) as HTMLInputElement;
        const rightOptionsFilter = getByDataQa(`two-box-multiselect--right-filter-${id}`) as HTMLInputElement;

        expect(leftOptionsFilter.placeholder).toEqual(filterPlaceholderLeft);
        expect(rightOptionsFilter.placeholder).toEqual(filterPlaceholderRight);
    });
});

const changeValue = (el: any, value: any) => {
    fireEvent.change(el, { target: { value } });
};
