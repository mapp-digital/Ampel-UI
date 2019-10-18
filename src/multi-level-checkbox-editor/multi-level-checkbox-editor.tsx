import { matches } from '@ampel-ui/common/search';
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
    searchPlaceholder?: string;
}

interface State {
    selectedNodeIds: Array<string>;
    searchValue: string;
}

interface SearchBarProps {
    onFilterChange: (filter: string) => void;
    searchPlaceholder: string;
}

const copy = <T extends {}>(o: T) => Object.assign({}, o);

const SearchBar: React.FunctionComponent<SearchBarProps> = (props) => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => props.onFilterChange(event.target.value);
    return (
        <div className="search-bar">
            <span className="search-bar-icon" />
            <input
                type="text"
                data-qa={`search-bar`}
                onChange={onChange}
                className="search-bar-filter"
                placeholder={props.searchPlaceholder}
            />
        </div>
    );
};

class MultiLevelCheckboxEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedNodeIds: [],
            searchValue: '',
        };

        this.onFilterChange = this.onFilterChange.bind(this);

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
                {this.props.searchPlaceholder && (
                    <div className="multi-level-checkbox-editor-filter" data-qa="multi-level-checkbox-editor-filter">
                        <SearchBar
                            searchPlaceholder={this.props.searchPlaceholder}
                            onFilterChange={this.onFilterChange}
                        />
                    </div>
                )}
                {this.getNodes().map(
                    (node, level) =>
                        hasChildren(node) && (
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

    private onFilterChange(searchValue: string) {
        this.setState({
            searchValue,
        });
    }

    private getNodes() {
        const nodes = [this.getSyntheticRootNode()].concat(this.state.selectedNodeIds.map(this.findNode));
        return this.getFilteredNodes(nodes, this.state.searchValue);
    }

    private getSyntheticRootNode(): Node {
        return {
            id: SYNTHETIC_ROOT_ID,
            label: '',
            children: this.props.nodes,
        };
    }

    private getFilteredNodes(nodes: Array<Node>, searchValue: string) {
        return nodes.map(copy).filter(function byLabel(node): any {
            if (matches(searchValue, node.label)) {
                return true;
            }
            if (node.children) {
                return (node.children = node.children.map(copy).filter(byLabel)).length;
            }
        });
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

    private isNodeSelected(node: Node) {
        return this.state.selectedNodeIds.includes(node.id);
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
