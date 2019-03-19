import * as React from 'react';

import { cleanup, render } from '@config/testing';
import { TriStateCheckbox, TriStateCheckboxState } from './tri-state-checkbox';

describe('TriStateCheckbox', () => {
    afterEach(cleanup);

    it('should exist', () => {
        const id = 'someId';
        const onChange = jest.fn();
        const { queryByDataQa } = render(
            <TriStateCheckbox id={id} value={TriStateCheckboxState.CHECKED} onChange={onChange} />
        );
        const component = queryByDataQa(`checkbox-${id}`);

        expect(component).toBeTruthy();
    });

    it(`should render 'indeterminate' class when given state`, () => {
        const id = 'someId';
        const onChange = jest.fn();
        const { getByDataQa } = render(
            <TriStateCheckbox id={id} value={TriStateCheckboxState.INDETERMINATE} onChange={onChange} />
        );
        const component = getByDataQa(`checkbox-${id}`);

        expect(component.classList.contains('indeterminate')).toBeTruthy();
    });

    it(`should set checked when state checked`, () => {
        const id = 'someId';
        const onChange = jest.fn();
        const { getByDataQa } = render(
            <TriStateCheckbox id={id} value={TriStateCheckboxState.CHECKED} onChange={onChange} />
        );
        const component = getByDataQa(`checkbox-${id}`) as HTMLInputElement;

        expect(component.checked).toBeTruthy();
    });

    it(`should set checked when state indeterminate`, () => {
        const id = 'someId';
        const onChange = jest.fn();
        const { getByDataQa } = render(
            <TriStateCheckbox id={id} value={TriStateCheckboxState.INDETERMINATE} onChange={onChange} />
        );
        const component = getByDataQa(`checkbox-${id}`) as HTMLInputElement;

        expect(component.checked).toBeTruthy();
    });

    it(`should set unchecked when state unchecked`, () => {
        const id = 'someId';
        const onChange = jest.fn();
        const { getByDataQa } = render(
            <TriStateCheckbox id={id} value={TriStateCheckboxState.UNCHECKED} onChange={onChange} />
        );
        const component = getByDataQa(`checkbox-${id}`) as HTMLInputElement;

        expect(component.checked).toBeFalsy();
    });

    it(`should invoke changeHandler with 'true' when previous state was unchecked`, () => {
        const id = 'someId';
        const onChange = jest.fn();
        const { getByDataQa } = render(
            <TriStateCheckbox id={id} value={TriStateCheckboxState.UNCHECKED} onChange={onChange} />
        );
        const component = getByDataQa(`checkbox-${id}`) as HTMLInputElement;

        component.click();

        expect(onChange).toHaveBeenCalledWith(true);
    });

    it(`should invoke changeHandler with 'true' when previous state was indeterminate`, () => {
        const id = 'someId';
        const onChange = jest.fn();
        const { getByDataQa } = render(
            <TriStateCheckbox id={id} value={TriStateCheckboxState.INDETERMINATE} onChange={onChange} />
        );
        const component = getByDataQa(`checkbox-${id}`) as HTMLInputElement;

        component.click();

        expect(onChange).toHaveBeenCalledWith(false);
    });

    it(`should invoke changeHandler with 'false' when previous state was checked`, () => {
        const id = 'someId';
        const onChange = jest.fn();
        const { getByDataQa } = render(
            <TriStateCheckbox id={id} value={TriStateCheckboxState.CHECKED} onChange={onChange} />
        );
        const component = getByDataQa(`checkbox-${id}`) as HTMLInputElement;

        component.click();

        expect(onChange).toHaveBeenCalledWith(false);
    });
});
