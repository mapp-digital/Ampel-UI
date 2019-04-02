import * as React from 'react';
import { Item } from './dropdown';
interface Props {
    items: Array<Item>;
    selectedItemWhen: (item: Item) => boolean;
}
declare const NavigationItems: React.FunctionComponent<Props>;
export { NavigationItems };
