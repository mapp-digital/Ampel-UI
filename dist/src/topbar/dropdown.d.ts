import * as React from 'react';
interface Link {
    url: string;
    target?: string;
}
interface Item {
    id: string;
    label: string;
    link?: Link;
    onClick?: () => void;
    isHeader?: boolean;
}
interface Props<T extends Item> {
    id: string;
    items: Array<T>;
    label: string;
    selectedItemWhen?: (item: T) => boolean;
}
interface State {
    isExpanded: boolean;
}
declare const HEADER_ITEM_CLASS = "header";
declare const HAS_ACTION_ITEM_CLASS = "has-action";
declare const SELECTED_CLASS = "selected";
declare class Dropdown<T extends Item> extends React.Component<Props<T>, State> {
    private node;
    constructor(props: Props<T>);
    componentWillMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private shouldRenderChildren;
    private renderItems;
    private renderLink;
    private renderButton;
    private handleGlobalClick;
    private collapseDropdownItems;
    private setNode;
    private toggleDropdown;
    private determineClasses;
    private isSelected;
}
export { Dropdown, Item, HAS_ACTION_ITEM_CLASS, HEADER_ITEM_CLASS, SELECTED_CLASS };
