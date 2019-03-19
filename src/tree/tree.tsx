import { isEqual } from 'lodash';
import * as React from 'react';

import { assignTo, walkTree } from '../api/tree';
import { INode, Node } from './node';

interface Props {
    nodes: Array<INode>;
    onNodeClick?: (clickedNode: INode) => void;
    treeDidChange?: (previous: Array<INode>, current: Array<INode>) => boolean;
    highlightedNodeId?: string;
}

interface State {
    nodes: Array<INode>;
}

class Tree extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            nodes: props.nodes.slice(),
        };

        this.onNodeClick = this.onNodeClick.bind(this);
        this.createExpandWalker = this.createExpandWalker.bind(this);
        this.isOrContainsExpanded = this.isOrContainsExpanded.bind(this);
        this.createHighlightWalker = this.createHighlightWalker.bind(this);
        this.isOrContainsHighlighted = this.isOrContainsHighlighted.bind(this);
    }

    public componentDidMount() {
        if (this.props.highlightedNodeId) {
            this.highlight(this.props.highlightedNodeId);
        }
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        const hightlightedNodeIdChanged = this.props.highlightedNodeId !== prevProps.highlightedNodeId;
        if (hightlightedNodeIdChanged) {
            this.highlight(this.props.highlightedNodeId || '');
        }
        if (this.treeDidChange(prevProps.nodes, this.props.nodes)) {
            this.setState({ nodes: this.props.nodes }, () => {
                this.highlight(this.props.highlightedNodeId || '');
            });
        }
    }

    public render() {
        return (
            <div role="tree" className="tree" data-qa="tree">
                {this.state.nodes.length && (
                    <ul className="nodes">
                        {this.state.nodes.map((node) => (
                            <Node node={node} key={node.id} onNodeClick={this.onNodeClick} />
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    private treeDidChange(previous: Array<INode>, current: Array<INode>) {
        return this.props.treeDidChange ? this.props.treeDidChange(previous, current) : !isEqual(previous, current);
    }

    private onNodeClick(clickedNode: INode) {
        if (this.props.onNodeClick) {
            this.props.onNodeClick(clickedNode);
        }

        this.highlight(clickedNode.id);
    }

    private highlight(id: string) {
        const nodes = this.state.nodes
            .map(walkTree(this.createHighlightWalker(id)))
            .map(walkTree(this.createExpandWalker(id)));
        this.setState({ nodes });
    }

    private createHighlightWalker(targetNodeId: string) {
        return (node: INode) => {
            const isHighlighted = this.isOrContainsHighlighted(targetNodeId, node);
            return assignTo(node, { isHighlighted });
        };
    }

    private createExpandWalker(targetNodeId: string) {
        return (node: INode) => {
            const shouldToggle = this.isTargetNode(targetNodeId, node);
            if (shouldToggle) {
                return assignTo(node, { isExpanded: !node.isExpanded });
            }
            const isExpanded = this.isOrContainsExpanded(targetNodeId, node);
            return assignTo(node, { isExpanded });
        };
    }

    private isOrContainsHighlighted(targetNodeId: string, node: INode): boolean {
        return (
            this.isTargetNode(targetNodeId, node) ||
            Boolean(
                node.children &&
                    node.children.filter((childNode) => this.isOrContainsHighlighted(targetNodeId, childNode)).length
            )
        );
    }

    private isOrContainsExpanded(targetNodeId: string, node: INode): boolean {
        return (
            this.isTargetNode(targetNodeId, node) ||
            Boolean(
                node.children &&
                    node.children.filter((childNode) => this.isOrContainsExpanded(targetNodeId, childNode)).length
            )
        );
    }

    private isTargetNode(targetNodeId: string, node: INode): boolean {
        return targetNodeId === node.id;
    }
}

export { Tree };
