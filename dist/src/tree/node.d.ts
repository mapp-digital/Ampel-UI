import * as React from 'react';
import { BaseNode } from '../api/tree';
interface INode extends BaseNode<INode, never> {
    isExpanded?: boolean;
}
interface Props {
    node: INode;
    level?: number;
    onNodeClick?: (clickedNode: INode) => void;
}
declare const EXPANDED_CLASS = "expanded";
declare const COLLAPSED_CLASS = "collapsed";
declare const NO_CHILD_CLASS = "no-child";
declare const HIGHLIGHTED_CLASS = "highlighted";
declare const LEVEL_CLASS_PREFIX = "level-";
declare class Node extends React.Component<Props, {}> {
    constructor(props: Props);
    render(): JSX.Element;
    private getHightlightedCLass;
    private getChildNodes;
    private getLevel;
    private getNextLevel;
    private getClasses;
    private getToggleClass;
    private handleClick;
    private isChildrenVisible;
    private isExpanded;
    private isHighlighted;
    private hasChildren;
}
export { Node, INode, EXPANDED_CLASS, COLLAPSED_CLASS, NO_CHILD_CLASS, HIGHLIGHTED_CLASS, LEVEL_CLASS_PREFIX };
