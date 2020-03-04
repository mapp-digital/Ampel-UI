import * as React from 'react';

import { matches } from '@ampel-ui/common/search';
import { SearchInput } from '@ampel-ui/input';

import { BaseNode, walkTree } from '../api/tree';
import { hasChildren, NodeBox } from './node-box';

const SYNTHETIC_ROOT_ID = '_ROOT';

interface Node extends BaseNode<Node, boolean> {}

interface Props {
    id: string;
    nodes: Array<Node>;
    onNodesChange: (nodes: Array<Node>) => void;
    levelHeaderLabels: Array<string>;
    searchPlaceholder?: string;
    infoText?: string;
    noDataText?: string;
    isInfoTextVisible?: (node: Node, level: number) => boolean;
    onFilterChange?: (value: string) => void;
    onNodeSelect?: (selectedNodeIds: Array<string>) => void;
    maxBoxCount?: number;
    emptyBoxText?: string;
}

interface State {
    selectedNodeIds: Array<string>;
    searchValue: string;
}

const copy = <T extends {}>(o: T) => ({ ...o });

const getFilteredNodes = (nodes: Array<Node>, searchValue: string) => {
    return nodes.map(copy).filter(function byLabel(node): any {
        if (hasChildren(node)) {
            node.children = node.children!.map(copy).filter(byLabel);
            return Boolean(node.children.length);
        }
        return matches(searchValue, node.label);
    });
};

class MultiLevelCheckboxEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedNodeIds: [],
            searchValue: '',
        };

        this.findNode = this.findNode.bind(this);
        this.selectNode = this.selectNode.bind(this);
        this.setNodeValue = this.setNodeValue.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.setNodeHighlight = this.setNodeHighlight.bind(this);
        this.setValueRecursively = this.setValueRecursively.bind(this);
        this.setHighlightRecursively = this.setHighlightRecursively.bind(this);
    }
    public render() {
        const nodes = this.getNodes();
        return (
            <>
                {this.props.searchPlaceholder && (
                    <div className="multi-level-checkbox-editor-filter" data-qa="multi-level-checkbox-editor-filter">
                        <SearchInput
                            id="multi-level-checkbox-editor--search-bar"
                            searchPlaceholder={this.props.searchPlaceholder}
                            onFilterChange={this.onFilterChange}
                            value={this.state.searchValue}
                        />
                    </div>
                )}
                {Boolean(nodes.length) ? (
                    <div
                        className="multi-level-checkbox-editor"
                        data-qa={`multi-level-checkbox-editor-${this.props.id}`}
                    >
                        {nodes.map((node, level) => (
                            <React.Fragment key={node.id}>
                                {hasChildren(node) && (
                                    <div
                                        style={{
                                            width: this.props.maxBoxCount
                                                ? ''
                                                : `${100 / this.props.levelHeaderLabels.length}%`,
                                        }}
                                        className={this.props.maxBoxCount ? 'arrange-type-box' : ''}
                                    >
                                        <NodeBox
                                            id={`${level}`}
                                            node={node}
                                            onSelectAll={this.setNodeValue}
                                            onNodeClick={this.selectNode.bind(this, level)}
                                            setNodeValue={this.setNodeValue}
                                            levelHeaderLabel={this.props.levelHeaderLabels[level]}
                                        />
                                    </div>
                                )}
                                {this.props.isInfoTextVisible &&
                                    this.props.isInfoTextVisible(node, level) &&
                                    this.getInfoText()}
                            </React.Fragment>
                        ))}
                        {this.checkIfSelectedNodeReachedLimit() ? (
                            <div className={'empty-nodebox'}>
                                <p className={'empty-nodebox-content'}>{this.props.emptyBoxText}</p>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    this.getNoDataText()
                )}
            </>
        );
    }

    private checkIfSelectedNodeReachedLimit() {
        return this.props.maxBoxCount && this.state.selectedNodeIds.length + 1 < this.props.maxBoxCount;
    }

    private getNodes() {
        const nodes = [this.getSyntheticRootNode()].concat(this.state.selectedNodeIds.map(this.findNode));
        if (this.props.searchPlaceholder) {
            return getFilteredNodes(nodes, this.state.searchValue);
        }
        return nodes;
    }

    private getSyntheticRootNode(): Node {
        return {
            id: SYNTHETIC_ROOT_ID,
            label: '',
            children: this.props.nodes,
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
            () => {
                this.setNodeHighlight(node);
                if (this.props.onNodeSelect) {
                    this.props.onNodeSelect(this.state.selectedNodeIds);
                }
            }
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
                isHighlighted: this.isNodeSelected(node),
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
                isHighlighted: this.isNodeSelected(node),
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

    private onFilterChange(searchValue: string) {
        this.setState(
            {
                searchValue,
            },
            () => {
                if (this.props.onFilterChange) {
                    this.props.onFilterChange(this.state.searchValue);
                }
            }
        );
    }

    private isNodeSelected(node: Node) {
        return this.state.selectedNodeIds.includes(node.id);
    }

    private getCondition(node: Node) {
        return (currentNode: Node) => node.id === SYNTHETIC_ROOT_ID || currentNode.id === node.id;
    }

    private getInfoText() {
        return (
            this.props.infoText && (
                <div className="info-box info" data-qa="info-text">
                    <span className="info-box-icon" />
                    {this.props.infoText}
                </div>
            )
        );
    }

    private getNoDataText() {
        return (
            this.props.noDataText && (
                <span className="info-box warning">
                    <span className="info-box-icon" />
                    {this.props.noDataText}
                </span>
            )
        );
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

export { MultiLevelCheckboxEditor, Node, Props as MultiLevelCheckboxEditorProps, getFilteredNodes };
