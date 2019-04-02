interface BaseNode<T extends BaseNode<T, V>, V> {
    id: string;
    label: string;
    value?: V;
    classes?: string;
    children?: Array<BaseNode<T, V>>;
    isHighlighted?: boolean;
}
declare type NodeMapper<T extends BaseNode<T, V>, V> = (node: BaseNode<T, V>) => BaseNode<T, V>;
declare const assignTo: <T extends BaseNode<T, V>, V>(node: T, changes: object) => {} & T & object;
declare const walkTree: <T extends BaseNode<T, V>, V>(nodeMapper: NodeMapper<T, V>) => (node: T) => BaseNode<T, V>;
export { assignTo, BaseNode, NodeMapper, walkTree };
