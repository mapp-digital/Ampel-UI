import * as React from 'react';

import { Checkbox } from '../checkbox';
import { Label } from '../label';
import { Node } from './multi-level-checkbox-editor';
import { TriStateCheckbox, TriStateCheckboxState } from './tri-state-checkbox';

interface Props {
    id: string;
    node: Node;
    onSelectAll: (node: Node, value: boolean) => void;
    onNodeClick: (node: Node) => void;
    setNodeValue: (node: Node, value: boolean) => void;
    selectAllLabel: string;
    levelHeaderLabel: string;
}

const hasChildren = (node: Node) => Boolean(node.children && node.children.length);

const valueToCheckboxState = (value: boolean) =>
    value ? TriStateCheckboxState.CHECKED : TriStateCheckboxState.UNCHECKED;

const countNodes = (predicate: (node: Node) => boolean, node: Node): number => {
    if (hasChildren(node)) {
        return node.children!.reduce((sum, childNode) => {
            return sum + countNodes(predicate, childNode);
        }, 0);
    }
    return predicate(node) ? 1 : 0;
};

const countCheckedNodes = countNodes.bind(null, (node: Node) => node.value);
const countAllNodes = countNodes.bind(null, () => true);

const getAggregateState = (nodes: Array<Node>): TriStateCheckboxState =>
    nodes.reduce((result, next) => {
        if (result === null) {
            return getNodeState(next);
        }

        const nodeState = getNodeState(next);
        if (result === TriStateCheckboxState.CHECKED && nodeState === TriStateCheckboxState.CHECKED) {
            return TriStateCheckboxState.CHECKED;
        }
        if (result === TriStateCheckboxState.UNCHECKED && nodeState === TriStateCheckboxState.UNCHECKED) {
            return TriStateCheckboxState.UNCHECKED;
        }
        return TriStateCheckboxState.INDETERMINATE;
    }, null)!;

const getNodeState = (node: Node) => {
    return hasChildren(node) ? getAggregateState(node.children!) : valueToCheckboxState(Boolean(node.value));
};

const countSelectedChildren = (node: Node) => {
    const selectedChildren = (node.children || [])
        .map(getNodeState)
        .filter((checkboxState) => checkboxState === TriStateCheckboxState.CHECKED);
    return selectedChildren.length;
};

const isNodeChecked = (node: Node) => {
    return hasChildren(node) && countSelectedChildren(node) === node.children!.length;
};

const NodeBox: React.FunctionComponent<Props> = (props) => (
    <div className="node-box" data-qa={`container-${props.levelHeaderLabel}`}>
        <span className="icon" />
        <div className="header">
            <h3 className="header-label" data-qa={`header-label-${props.id}`}>
                {props.levelHeaderLabel}
            </h3>
        </div>
        <div className="select-all">
            <Checkbox
                id={`select-all-${props.id}`}
                value={isNodeChecked(props.node)}
                onChange={props.onSelectAll.bind(null, props.node)}
            />
            <Label for={`select-all-${props.id}`} value={props.selectAllLabel} />
        </div>
        <ul className="node-list">
            {hasChildren(props.node) &&
                props.node.children!.map((node) => (
                    <li
                        key={node.id}
                        role="listitem"
                        data-qa={`node-${node.label}`}
                        onClick={props.onNodeClick.bind(null, node)}
                        className="node-list-item"
                    >
                        <div>
                            <TriStateCheckbox
                                id={`node-${node.id}`}
                                value={getNodeState(node)}
                                onChange={props.setNodeValue.bind(null, node)}
                            />
                            <Label for={`node-${node.id}`} value={node.label} />
                        </div>
                        {hasChildren(node) ? (
                            <span className="child-node-count" data-qa={`node-label-${node.id}`}>{`${countCheckedNodes(
                                node
                            )} / ${countAllNodes(node)}`}</span>
                        ) : null}
                    </li>
                ))}
        </ul>
    </div>
);

export { countNodes, getAggregateState, hasChildren, NodeBox };
