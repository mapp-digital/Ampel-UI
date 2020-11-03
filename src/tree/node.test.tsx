import { COLLAPSED_CLASS, EXPANDED_CLASS, NO_CHILD_CLASS, DISABLED_CLASS, Node } from './node';

import * as React from 'react';

import { cleanup, render } from '@config/testing';

afterEach(cleanup);

describe('Node', () => {
    it('should have first level if none given', () => {
        const id = '1';
        const node = {
            id,
            label: '1',
        };

        const { getByDataQa } = render(<Node node={node} />);
        const element = getByDataQa('node-' + id);

        expect(element.classList.contains('level-1')).toBeTruthy();
    });

    it('should add an incremented level for child nodes', () => {
        const childId = '1-1';
        const node = {
            id: '1',
            label: '1',
            isExpanded: true,
            children: [
                {
                    id: childId,
                    label: '1-1',
                },
            ],
        };

        const { getByDataQa } = render(<Node level={2} node={node} />);
        const element = getByDataQa('node-' + childId);

        expect(element.classList.contains('level-3')).toBeTruthy();
    });

    it('should override expand/collapsed/nochild with given classes', () => {
        const someClass = 'some-class';
        const id = '1';
        const node = {
            id,
            label: '1',
            classes: someClass,
        };

        const { getByDataQa } = render(<Node node={node} />);
        const iconElement = getByDataQa('node--icon-' + id);

        expect(iconElement.classList.contains(someClass)).toBeTruthy();
        expect(iconElement.classList.contains(NO_CHILD_CLASS)).toBeFalsy();
        expect(iconElement.classList.contains(EXPANDED_CLASS)).toBeFalsy();
        expect(iconElement.classList.contains(COLLAPSED_CLASS)).toBeFalsy();
        expect(iconElement.classList.contains(DISABLED_CLASS)).toBeFalsy();
    });

    it('should contain disabled class if disabled', () => {
        const id = '1';
        const node = {
            id,
            label: '1',
            disabled: true,
        };

        const { getByDataQa } = render(<Node node={node} />);
        const disabledElement = getByDataQa('node-' + id);

        expect(disabledElement.classList.contains('disabled'));
    });

    it('should render content even it is disabled', () => {
        const id = '1';
        const node = {
            id,
            label: '1',
            disabled: true,
        };

        const { getByDataQa } = render(<Node node={node} />);
        const disabledElement = getByDataQa('node-' + id);
        expect(disabledElement.textContent).toEqual('1');
    });

    it('should show tooltip if disabledMessage provided', () => {
        const id = '1';
        const node = {
            id,
            label: '1',
            disabled: true,
            disabledMessage: 'Sample tooltip message',
        };

        const { getByDataQa } = render(<Node node={node} />);
        const disabledElement = getByDataQa('node-' + id);
        const tooltipElement = disabledElement.getElementsByClassName('tooltip-trigger')[0];

        expect(disabledElement.textContent).toEqual('1');
        expect(tooltipElement).toBeTruthy();
    });
});
