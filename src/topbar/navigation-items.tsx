import * as React from 'react';

import { Item, SELECTED_CLASS } from './dropdown';

interface Props {
    items: Array<Item>;
    selectedItemWhen: (item: Item) => boolean;
}

const Link = (item: Item) => (
    <a
        href={item.link && item.link.url}
        target={item.link && item.link.target}
        data-qa={`navigation--item-${item.id}`}
        className="navigation-item"
    >
        {item.label}
    </a>
);

const Button = (item: Item) => (
    <button type="button" onClick={item.onClick} data-qa={`navigation--item-${item.id}`} className="navigation-item">
        {item.label}
    </button>
);

const NavigationItems: React.FunctionComponent<Props> = (props) => (
    <ul className="navigation-items">
        {props.items.map((item) => (
            <li
                key={item.id}
                data-qa={`navigation--item-container-${item.id}`}
                className={`navigation-item-container ${props.selectedItemWhen(item) ? SELECTED_CLASS : ''}`}
            >
                {item.link ? <Link {...item} /> : <Button {...item} />}
            </li>
        ))}
    </ul>
);

export { NavigationItems };
