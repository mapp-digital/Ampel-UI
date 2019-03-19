import * as React from 'react';

import { Action } from './sidebar';

interface Props {
    actions: Array<Action>;
}

const SidebarFooter: React.FunctionComponent<Props> = (props) => {
    return (
        <div className="sidebar-footer" data-qa="sidebar-footer">
            <ul className="items">
                {props.actions.map((action) => {
                    return (
                        <li
                            key={action.id}
                            role="menuitem"
                            onClick={action.onClick.bind(null, action.id)}
                            data-qa={`sidebar-footer--item-${action.id}`}
                            className="item"
                        >
                            <div className="item-content">
                                <span className={action.classes} />
                                <span className="item-label">{action.label}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export { SidebarFooter, Action };
