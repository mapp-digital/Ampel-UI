import * as React from 'react';

import { INode } from './inode';

interface Props {
    node: INode;
    level?: number;
    onNodeClick?: (clickedNode: INode) => void;
}

const EXPANDED_CLASS = 'expanded';
const COLLAPSED_CLASS = 'collapsed';
const NO_CHILD_CLASS = 'no-child';
const HIGHLIGHTED_CLASS = 'highlighted';
const LEVEL_CLASS_PREFIX = 'level-';

class Node extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
        this.isExpanded = this.isExpanded.bind(this);
        this.hasChildren = this.hasChildren.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.isChildrenVisible = this.isChildrenVisible.bind(this);
    }

    public render() {
        return (
            <li
                role="listitem"
                onClick={this.handleClick}
                data-qa={`node-${this.props.node.id}`}
                className={`node ${this.getHightlightedCLass()} ${LEVEL_CLASS_PREFIX + this.getLevel()}`}
            >
                <div className="node-content">
                    <span className={this.getClasses()} data-qa={`node--icon-${this.props.node.id}`} />
                    <span className="node-label">{this.props.node.label}</span>
                    {this.isChildrenVisible() && <ul className="nodes">{this.getChildNodes()}</ul>}
                </div>
            </li>
        );
    }

    private getHightlightedCLass() {
        return this.isHighlighted() ? HIGHLIGHTED_CLASS : '';
    }

    private getChildNodes() {
        return this.props.node.children!.map((node) => (
            <Node node={node} key={node.id} level={this.getNextLevel()} onNodeClick={this.props.onNodeClick} />
        ));
    }

    private getLevel() {
        return this.props.level || 1;
    }

    private getNextLevel() {
        return this.getLevel() + 1;
    }

    private getClasses() {
        if (this.props.node.classes) {
            return this.props.node.classes;
        }

        if (this.hasChildren()) {
            return this.getToggleClass();
        }

        return NO_CHILD_CLASS;
    }

    private getToggleClass() {
        return this.isExpanded() ? EXPANDED_CLASS : COLLAPSED_CLASS;
    }

    private handleClick(event: React.SyntheticEvent) {
        event.stopPropagation();
        if (this.props.onNodeClick) {
            this.props.onNodeClick(this.props.node);
        }
    }

    private isChildrenVisible() {
        return this.hasChildren() && this.isExpanded();
    }

    private isExpanded() {
        return this.props.node.isExpanded;
    }

    private isHighlighted() {
        return this.props.node.isHighlighted;
    }

    private hasChildren() {
        return (this.props.node.children || []).length > 0;
    }
}

export { Node, INode, EXPANDED_CLASS, COLLAPSED_CLASS, NO_CHILD_CLASS, HIGHLIGHTED_CLASS, LEVEL_CLASS_PREFIX };
