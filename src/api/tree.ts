import { LabelInformation } from '../multi-level-checkbox-editor/node-label';

interface BaseNode<T extends BaseNode<T, V>, V> {
    id: string;
    label: string;
    value?: V;
    classes?: string;
    children?: Array<BaseNode<T, V>>;
    isHighlighted?: boolean;
    labelInformation?: LabelInformation;
}

type NodeMapper<T extends BaseNode<T, V>, V> = (node: BaseNode<T, V>) => BaseNode<T, V>;

const assignTo = <T extends BaseNode<T, V>, V>(node: T, changes: object) => {
    return Object.assign({}, node, changes);
};

const walkTree = <T extends BaseNode<T, V>, V>(nodeMapper: NodeMapper<T, V>) => {
    return (node: T): BaseNode<T, V> => {
        const children = node.children && node.children.map(walkTree(nodeMapper));
        const nodeWithTraversedChildren = assignTo(node, { children });
        return nodeMapper(nodeWithTraversedChildren);
    };
};

export { assignTo, BaseNode, NodeMapper, walkTree };
