import * as React from 'react';
import { INode as Node } from '../tree';
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
declare const Sidebar: React.FunctionComponent<Props>;
export { Action, Sidebar };
