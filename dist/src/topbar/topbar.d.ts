import * as React from 'react';
import { Item } from './dropdown';
interface Props<T extends Item> {
    mainItems: Array<T>;
    subItems: Array<T>;
    dropdownLabel: string;
    selectedItemWhen: <P extends T>(item: P) => boolean;
}
declare class Topbar<T extends Item> extends React.Component<Props<T>> {
    render(): JSX.Element;
    private getSubItems;
}
export { Topbar };
