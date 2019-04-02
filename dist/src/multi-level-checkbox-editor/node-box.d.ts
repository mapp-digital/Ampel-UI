import * as React from 'react';
import { Node } from './multi-level-checkbox-editor';
import { TriStateCheckboxState } from './tri-state-checkbox';
interface Props {
    id: string;
    node: Node;
    onSelectAll: (node: Node, value: boolean) => void;
    onNodeClick: (node: Node) => void;
    setNodeValue: (node: Node, value: boolean) => void;
    selectAllLabel: string;
    levelHeaderLabel: string;
}
declare const hasChildren: (node: Node) => boolean;
declare const countNodes: (predicate: (node: Node) => boolean, node: Node) => number;
declare const getAggregateState: (nodes: Node[]) => TriStateCheckboxState;
declare const NodeBox: React.FunctionComponent<Props>;
export { countNodes, getAggregateState, hasChildren, NodeBox };
