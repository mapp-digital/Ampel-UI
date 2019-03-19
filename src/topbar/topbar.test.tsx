import * as React from 'react';

import { cleanup, render } from '@config/testing';

import { Topbar } from './';

describe('Topbar', () => {
    afterEach(cleanup);

    it('should render a Topbar splitting the items to main and sub items', () => {
        const mainItems = [
            {
                id: 'id1',
                label: 'Some Label',
            },
            {
                id: 'id2',
                label: 'Some Label',
            },
            {
                id: 'id3',
                label: 'Some Label',
            },
            {
                id: 'id4',
                label: 'Some Label',
            },
        ];
        const subItems = [
            {
                id: 'id5',
                label: 'Some Label',
            },
            {
                id: 'id6',
                label: 'Some Label',
            },
        ];
        const dropdownLabel = 'Some Dropdown Label';
        const selectedItemWhen = jest.fn();

        const { getByDataQa, queryAllByDataQa } = render(
            <Topbar
                mainItems={mainItems}
                subItems={subItems}
                dropdownLabel={dropdownLabel}
                selectedItemWhen={selectedItemWhen}
            />
        );

        const dropdownToggle = getByDataQa(`dropdown--toggle-topbar-misc-dropdown`);
        dropdownToggle.click();

        const subNavigationItems = queryAllByDataQa(/dropdown--item-id*./);
        expect(subNavigationItems.length).toEqual(2);

        const mainNavigationElements = queryAllByDataQa(/navigation--item-id*./);
        expect(mainNavigationElements.length).toEqual(4);
    });
});
