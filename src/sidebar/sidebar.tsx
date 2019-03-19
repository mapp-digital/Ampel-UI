import * as React from 'react';

import { INode as Node, Tree } from '../tree';

import { SidebarFooter } from './sidebar-footer';

interface Action {
    id: string;
    label: string;
    onClick: () => void;
    classes?: string;
}

interface Props {
    treeNodes: Array<Node>;
    footerItems: Array<Action>;
    onNodeClick?: (clickedNode: Node) => void;
    highlightedNodeId: string;
}

const Sidebar: React.FunctionComponent<Props> = (props) => (
    <nav className="sidebar" data-qa="sidebar">
        <Tree nodes={props.treeNodes} onNodeClick={props.onNodeClick} highlightedNodeId={props.highlightedNodeId} />
        <SidebarFooter actions={props.footerItems} />
    </nav>
);

export { Action, Sidebar };
