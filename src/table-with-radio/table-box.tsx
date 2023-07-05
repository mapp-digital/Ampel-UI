import * as React from 'react';

interface NodeAccess extends BaseNode<NodeAccess, boolean> {}
interface BaseNode<T extends BaseNode<T, V>, V> {
    id: string;
    label: string;
    value?: V;
    classes?: string;
    configurable?: boolean;
    children?: Array<BaseNode<T, V>>;
    isHighlighted?: boolean;
    access: string;
}
interface TableRow {
    id: number;
    name: string;
    value: boolean;
}
interface Props {
    nodes: Array<NodeAccess>;
    tableData: Array<TableRow>;
    isNodeSelected: (node: NodeAccess, tableData: TableRow) => boolean;
    onNodeChange: (node: NodeAccess, tableData: TableRow) => any;
    setNodeValue: (node: NodeAccess, tableData: TableRow) => any;
}

const hasChildren = (node: NodeAccess) => Boolean(node.children && node.children.length && node.configurable);

const TableBox: React.FunctionComponent<Props> = (props) => {
    const renderNodes = (nodes: Array<NodeAccess>) => {
        return nodes.map((node) => (
            <React.Fragment key={node.id}>
                {node.configurable ? (
                    <tr>
                        <td>{node.label}</td>
                        {props.tableData.map((row) => (
                            <td key={row.id}>
                                <input
                                    type="radio"
                                    name={'selectedRow-' + node.id + row.id}
                                    data-qqq={node.id + row.id}
                                    checked={props.isNodeSelected(node, row)}
                                    aria-checked={props.isNodeSelected.bind(node, row)}
                                    onChange={props.onNodeChange(node, row)}
                                />
                            </td>
                        ))}
                    </tr>
                ) : null}
                {hasChildren(node) && renderNodes(node.children!)}
            </React.Fragment>
        ));
    };

    return <>{renderNodes(props.nodes)}</>;
};

export { TableBox, NodeAccess };
