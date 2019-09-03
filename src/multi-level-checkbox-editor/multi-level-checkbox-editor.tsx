import * as React from 'react';

import { BaseNode, walkTree } from '../api/tree';
import { hasChildren, NodeBox } from './node-box';

const SYNTHETIC_ROOT_ID = '_ROOT';

interface Node extends BaseNode<Node, boolean> {}

interface Props {
    id: string;
    nodes: Array<Node>;
    onNodesChange: (nodes: Array<Node>) => void;
    levelHeaderLabels: Array<string>;
}

interface State {
    selectedNodeIds: Array<string>;
}

class MultiLevelCheckboxEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedNodeIds: [],
        };

        this.findNode = this.findNode.bind(this);
        this.selectNode = this.selectNode.bind(this);
        this.setNodeValue = this.setNodeValue.bind(this);
        this.setNodeHighlight = this.setNodeHighlight.bind(this);
        this.setValueRecursively = this.setValueRecursively.bind(this);
        this.setHighlightRecursively = this.setHighlightRecursively.bind(this);
    }

    public render() {
        return (
            <div className="multi-level-checkbox-editor" data-qa={`multi-level-checkbox-editor-${this.props.id}`}>
                {this.getNodes().map(
                    (node, level) =>
                        hasChildren(node) &&
                        node.value && (
                            <div key={node.id} style={{ width: `${100 / this.props.levelHeaderLabels.length}%` }}>
                                <NodeBox
                                    id={`${level}`}
                                    node={node}
                                    onSelectAll={this.setNodeValue}
                                    onNodeClick={this.selectNode.bind(this, level)}
                                    setNodeValue={this.setNodeValue}
                                    levelHeaderLabel={this.props.levelHeaderLabels[level]}
                                />
                            </div>
                        )
                )}
            </div>
        );
    }

    private getNodes() {
        return [this.getSyntheticRootNode()].concat(this.state.selectedNodeIds.map(this.findNode));
    }

    private getSyntheticRootNode(): Node {
        return {
            id: SYNTHETIC_ROOT_ID,
            label: '',
            children: this.props.nodes,
            value: true,
        };
    }

    private selectNode(level: number, node: Node) {
        this.setState(
            (state) => {
                const selectedNodeIds = state.selectedNodeIds.slice(0, level);
                if (node.children && node.children.length) {
                    selectedNodeIds.push(node.id);
                }
                return { selectedNodeIds };
            },
            () => this.setNodeHighlight(node)
        );
    }

    private setNodeHighlight(node: Node) {
        const condition = this.getCondition(node);
        const updatedNodes = this.props.nodes.map(walkTree(this.createSetHighlightWalker(condition)));
        this.props.onNodesChange(updatedNodes);
    }

    private setNodeValue(node: Node, value: boolean) {
        const condition = this.getCondition(node);
        const updatedNodes = this.props.nodes.map(walkTree(this.createSetValueWalker(condition, value)));
        this.props.onNodesChange(updatedNodes);
    }

    private createSetHighlightWalker(condition: (node: Node) => boolean) {
        return (node: Node) => {
            const nodeWithHighlight = {
                ...node,
                isHighlighted: this.isNodeHighlighted(node),
            };
            if (condition(nodeWithHighlight)) {
                return this.setHighlightRecursively(nodeWithHighlight);
            }
            return nodeWithHighlight;
        };
    }

    private createSetValueWalker(condition: (node: Node) => boolean, value: boolean) {
        return (node: Node) => {
            const nodeWithHighlight = {
                ...node,
                isHighlighted: this.isNodeHighlighted(node),
            };
            if (condition(nodeWithHighlight)) {
                return this.setValueRecursively(value, nodeWithHighlight);
            }
            return nodeWithHighlight;
        };
    }

    private setHighlightRecursively(node: Node) {
        if (hasChildren(node)) {
            node.children = node.children!.map(this.setHighlightRecursively);
        }
        return node;
    }

    private setValueRecursively(v: boolean, node: Node) {
        const newNode = { ...node, value: v };
        if (hasChildren(newNode)) {
            newNode.children = newNode.children!.map(this.setValueRecursively.bind(this, v));
        }
        return newNode;
    }

    private isNodeHighlighted(node: Node) {
        return node.value && this.state.selectedNodeIds.includes(node.id);
    }

    private getCondition(node: Node) {
        return (currentNode: Node) => node.id === SYNTHETIC_ROOT_ID || currentNode.id === node.id;
    }

    private findNode(nodeId: string): Node {
        let foundNode = null;
        this.props.nodes.forEach(
            walkTree((node) => {
                if (node.id === nodeId) {
                    foundNode = node;
                }
                return node;
            })
        );
        if (!foundNode) {
            throw new Error(`Unable to find node with id '${nodeId}'`);
        }
        return foundNode;
    }
}

export { MultiLevelCheckboxEditor, Node, Props as MultiLevelCheckboxEditorProps };
