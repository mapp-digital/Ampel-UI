import * as React from 'react';

import { cleanup, render } from '@config/testing';

import { Item, SELECTED_CLASS } from './dropdown';
import { NavigationItems } from './navigation-items';

describe('NavigationItems', () => {
    afterEach(cleanup);

    it('should render a given item', () => {
        const id = 'id';
        const items = [
            {
                id,
                label: 'Some Label',
            },
        ];
        const selectedItemWhen = jest.fn();

        const { getByDataQa } = render(<NavigationItems items={items} selectedItemWhen={selectedItemWhen} />);

        const navigationItemElement = getByDataQa(`navigation--item-${id}`);

        expect(navigationItemElement).toBeTruthy();
    });

    it(`should add 'selected' class to element fulfilling the selectedPredicate`, () => {
        const id = 'someId';
        const label = 'Some Label';
        const selectedItemWhen = (item: Item) => item.label === label;
        const items = [
            {
                id,
                label,
            },
        ];
        const { getByDataQa } = render(<NavigationItems items={items} selectedItemWhen={selectedItemWhen} />);

        const navigationItemElement = getByDataQa(`navigation--item-container-${id}`);

        expect(navigationItemElement.classList.contains(SELECTED_CLASS)).toBeTruthy();
    });

    it('should invoke a given onClick handler', () => {
        const id = 'someId';
        const onClick = jest.fn();
        const items = [
            {
                id,
                label: 'Some Label',
                onClick,
            },
        ];
        const selectedItemWhen = () => false;
        const { getByDataQa } = render(<NavigationItems items={items} selectedItemWhen={selectedItemWhen} />);

        const navigationItemElement = getByDataQa(`navigation--item-${id}`);
        navigationItemElement.click();

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render a link', () => {
        const id = 'someId';
        const url = 'http://some.url/';
        const items = [
            {
                id,
                label: 'Some Label',
                link: {
                    url,
                },
            },
        ];
        const selectedItemWhen = () => false;
        const { getByDataQa } = render(<NavigationItems items={items} selectedItemWhen={selectedItemWhen} />);

        const navigationLink = getByDataQa(`navigation--item-${id}`) as HTMLAnchorElement;

        expect(navigationLink.href).toEqual(url);
    });
});
