import * as React from 'react';

import { cleanup, render } from '@config/testing';

import { Dropdown, HAS_ACTION_ITEM_CLASS, HEADER_ITEM_CLASS, Item, SELECTED_CLASS } from './dropdown';

const renderExpandedDropdownWithProps = (props: any) => {
    const id = props.id || 'dropdownId';
    const testUtils = render(<Dropdown id={id} {...props} />);
    const dropdownToggleElement = testUtils.getByDataQa(`dropdown--toggle-${id}`);
    dropdownToggleElement.click();
    return testUtils;
};

const renderExpandedDropdown = (items: Array<Item>) => {
    return renderExpandedDropdownWithProps({ items });
};

const hijackEventListeners = () => {
    const initialAddEventListener = document.addEventListener;
    const listeners: any = {};
    document.addEventListener = jest.fn((event, cb) => {
        listeners[event] = cb;
    });

    listeners._reset = () => {
        document.addEventListener = initialAddEventListener;
    };

    return listeners;
};

describe('Dropdown', () => {
    afterEach(cleanup);

    it('should exist', () => {
        const id = 'id';
        const { getByDataQa } = render(<Dropdown id={id} items={[]} label="" />);

        const dropdownElement = getByDataQa(`dropdown-${id}`);

        expect(dropdownElement).toBeTruthy();
    });

    it('should render a given item', () => {
        const id = 'someId';
        const items = [
            {
                id,
                label: 'Some Label',
            },
        ];
        const { getByDataQa } = renderExpandedDropdown(items);

        const dropdownItemElement = getByDataQa(`dropdown--item-${id}`);

        expect(dropdownItemElement).toBeTruthy();
    });

    it(`should have '${HEADER_ITEM_CLASS}' class for header items`, () => {
        const id = 'someId';
        const items = [
            {
                id,
                label: 'Some Label',
                isHeader: true,
            },
        ];
        const { getByDataQa } = renderExpandedDropdown(items);

        const dropdownItemElement = getByDataQa(`dropdown--item-container-${id}`);

        expect(dropdownItemElement.classList.contains(HEADER_ITEM_CLASS)).toBeTruthy();
    });

    it(`should have '${HAS_ACTION_ITEM_CLASS}' class for items with 'onClick'`, () => {
        const id = 'someId';
        const items = [
            {
                id,
                label: 'Some Label',
                onClick: jest.fn(),
            },
        ];
        const { getByDataQa } = renderExpandedDropdown(items);

        const dropdownItemElement = getByDataQa(`dropdown--item-container-${id}`);

        expect(dropdownItemElement.classList.contains(HAS_ACTION_ITEM_CLASS)).toBeTruthy();
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
        const { getByDataQa } = renderExpandedDropdown(items);

        const dropdownItemElement = getByDataQa(`dropdown--item-${id}`);
        dropdownItemElement.click();

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
        const { getByDataQa } = renderExpandedDropdown(items);

        const navigationLink = getByDataQa(`dropdown--item-${id}`) as HTMLAnchorElement;

        expect(navigationLink.href).toEqual(url);
    });

    it('should render a given label', () => {
        const id = 'someId';
        const label = 'Some Label';
        const items = [
            {
                id,
                label,
            },
        ];
        const { getByText } = renderExpandedDropdown(items);

        const dropdownItemLabel = getByText(label);

        expect(dropdownItemLabel.textContent).toEqual(label);
    });

    it('should intially be collapsed and expanded on toggle click', () => {
        const id = 'dropdownId';
        const itemId = 'itemId';
        const items = [
            {
                id: itemId,
                label: 'Some Label',
            },
        ];
        const { queryByDataQa, getByDataQa } = render(<Dropdown id={id} items={items} label="" />);

        const absentDropdownItemElement = queryByDataQa(`dropdown--item-${itemId}`);
        expect(absentDropdownItemElement).toBeFalsy();

        const dropdownToggleElement = getByDataQa(`dropdown--toggle-${id}`);
        dropdownToggleElement.click();

        const presentDropdownItemElement = queryByDataQa(`dropdown--item-${itemId}`);
        expect(presentDropdownItemElement).toBeTruthy();

        dropdownToggleElement.click();

        const goneDropdownItemElement = queryByDataQa(`dropdown--item-${itemId}`);
        expect(goneDropdownItemElement).toBeFalsy();
    });

    it('should close on outer click', () => {
        const listeners = hijackEventListeners();
        const id = 'dropdownId';
        const items = [
            {
                id: 'someId',
                label: 'Some Label',
            },
        ];
        const { getByDataQa, queryByDataQa } = render(
            <div>
                <div data-qa="outer">outer</div>
                <Dropdown id={id} items={items} label="" />
            </div>
        );
        const toggle = getByDataQa('dropdown--toggle-' + id);
        toggle.click();

        const outer = getByDataQa('outer');
        listeners.mousedown({ target: outer });

        const optionItems = queryByDataQa('dropdown--items-' + id);
        expect(optionItems).toBeFalsy();
        listeners._reset();
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
        const { getByDataQa } = renderExpandedDropdownWithProps({ items, selectedItemWhen });

        const dropdownItemElement = getByDataQa(`dropdown--item-container-${id}`);

        expect(dropdownItemElement.classList.contains(SELECTED_CLASS)).toBeTruthy();
    });
});
