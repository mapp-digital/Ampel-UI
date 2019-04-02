import * as React from 'react';
import { INode } from './node';
interface Props {
    nodes: Array<INode>;
    onNodeClick?: (clickedNode: INode) => void;
    treeDidChange?: (previous: Array<INode>, current: Array<INode>) => boolean;
    highlightedNodeId?: string;
}
interface State {
    nodes: Array<INode>;
}
declare class Tree extends React.Component<Props, State> {
    constructor(props: Props);
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props, prevState: State): void;
    render(): JSX.Element;
    private treeDidChange;
    private onNodeClick;
    private highlight;
    private createHighlightWalker;
    private createExpandWalker;
    private isOrContainsHighlighted;
    private isOrContainsExpanded;
    private isTargetNode;
}
export { Tree };
