import * as React from 'react';

import { cleanup, render } from '@config/testing';

import { FormGroup, ValidityState } from './form-group';

afterEach(cleanup);

describe('FormGroup', () => {
    it('should handle changes to a single string field', () => {
        const id = 'someGroup';
        const onClick = jest.fn();
        const { getByDataQa } = render(
            <FormGroup id={id} isExpanded={false} label="" onClick={onClick} validityState={ValidityState.VALID} />
        );
        const groupElement = getByDataQa(`form-group--toggle-${id}`);
        groupElement.click();

        expect(onClick).toHaveBeenCalledWith(id);
    });

    it("should show it's children when it is expanded", () => {
        const id = 'someGroup';
        const childContent = 'someChildContent';
        const { queryByText } = render(
            <FormGroup id={id} isExpanded={true} label="" onClick={jest.fn()} validityState={ValidityState.VALID}>
                <span>{childContent}</span>
            </FormGroup>
        );

        expect(queryByText(childContent)).toBeTruthy();
    });

    it("should show NOT it's children when it is NOT expanded", () => {
        const id = 'someGroup';
        const childContent = 'someChildContent';
        const { queryByText } = render(
            <FormGroup id={id} isExpanded={false} label="" onClick={jest.fn()} validityState={ValidityState.VALID}>
                <span>{childContent}</span>
            </FormGroup>
        );

        expect(queryByText(childContent)).toBeFalsy();
    });

    it('should be rendered with a class corresponding to its validityState', () => {
        const id = 'someGroup';
        const childContent = 'someChildContent';
        const { getByDataQa } = render(
            <FormGroup id={id} isExpanded={false} label="" onClick={jest.fn()} validityState={ValidityState.VALID}>
                <span>{childContent}</span>
            </FormGroup>
        );

        const groupElement = getByDataQa(`form-group-${id}`);

        expect(groupElement.classList.contains('group-valid')).toBeTruthy();
    });

    it('should render the label', () => {
        const id = 'someGroup';
        const label = 'Some Group';
        const { getByDataQa } = render(
            <FormGroup
                id={id}
                isExpanded={false}
                label={label}
                onClick={jest.fn()}
                validityState={ValidityState.VALID}
            />
        );

        const groupToggleElement = getByDataQa(`form-group--toggle-${id}`);

        expect(groupToggleElement.textContent).toEqual(label);
    });
});
