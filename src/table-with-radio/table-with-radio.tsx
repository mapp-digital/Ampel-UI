import * as React from 'react';

import { isEqual } from 'lodash';

import { NodeAccess, TableBox } from './table-box';
interface TableRow {
    id: number;
    name: string;
    value: boolean;
    label: string;
}
interface Props {
    tableRowList?: Array<TableRow>;
    nodes: Array<NodeAccess>;
    onNodesChange: (nodes: Array<NodeAccess | undefined>) => void;
}
interface State {
    selectedRow: Array<string>;
    tableData: Array<TableRow>;
    selectedHeading: number;
}
class TableWithRadioButtons extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const tableData = props.tableRowList
            ? props.tableRowList
            : [
                  { id: 1, name: 'NONE', value: false, label: 'No Access' },
                  { id: 2, name: 'READ', value: false, label: 'Read Only' },
                  { id: 3, name: 'FULL', value: false, label: 'Read/Write' },
              ];
        this.state = {
            selectedHeading: 0,
            tableData,
            selectedRow: this.initNodeIds(tableData, this.props.nodes.slice()),
        };
        this.setNodeValue = this.setNodeValue.bind(this);
        this.isNodeSelected = this.isNodeSelected.bind(this);
        this.onNodeChange = this.onNodeChange.bind(this);
        this.onChangeHeading = this.onChangeHeading.bind(this);
    }
    public componentDidMount() {
        const seletedNodes = this.initNodeIds(this.state.tableData, this.props.nodes.slice());
        this.setState({
            selectedRow: seletedNodes,
        });
        if (seletedNodes.length > 0) {
            const suffixes = seletedNodes.map((selectNode) => selectNode.split('#')[1]);
            const isSameSuffix = suffixes.every((suffix) => suffix === suffixes[0]);
            if (isSameSuffix) {
                const selectedHeading = parseInt(suffixes[0], 10);
                this.setState({
                    selectedHeading,
                });
            }
        }
    }
    public componentDidUpdate(prevProps: Props) {
        const seletedNodes = this.initNodeIds(this.state.tableData, this.props.nodes.slice());

        if (!isEqual(prevProps.nodes, this.props.nodes)) {
            this.setState({
                selectedRow: seletedNodes,
            });
            if (seletedNodes.length > 0) {
                const suffixes = seletedNodes.map((selectNode) => selectNode.split('#')[1]);
                const isSameSuffix = suffixes.every((suffix) => suffix === suffixes[0]);
                if (isSameSuffix) {
                    const selectedHeading = parseInt(suffixes[0], 10);
                    this.setState({
                        selectedHeading,
                    });
                }
            }
        }
    }
    public render() {
        return (
            <table className="table-with-radio">
                <thead className="tabledata-head">
                    <tr>
                        <th />
                        {this.state.tableData.map((row) => (
                            <th key={row.id}>
                                <input
                                    type="radio"
                                    name="selectedRow"
                                    className={this.state.selectedHeading.toString()}
                                    checked={this.state.selectedHeading === row.id}
                                    aria-checked={this.state.selectedHeading === row.id}
                                    onChange={this.onChangeHeading(row)}
                                />
                                <span>{row.label}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table-with-radio-body">
                    <TableBox
                        nodes={this.props.nodes}
                        isNodeSelected={this.isNodeSelected}
                        tableData={this.state.tableData}
                        onNodeChange={this.onNodeChange}
                        setNodeValue={this.setNodeValue}
                    />
                </tbody>
            </table>
        );
    }

    private setNodeValue = (node: NodeAccess, tabledata: TableRow) => {
        return () => {
            this.setState(
                {
                    selectedHeading: 0,
                    selectedRow: this.selectRow(node, tabledata),
                },
                () => {
                    this.populateData(this.props.nodes.slice());
                }
            );
        };
    };
    private isNodeSelected = (node: NodeAccess, tabledata: TableRow) => {
        const fullId = this.appendNodeIdWithTableData(node, tabledata);
        return this.state.selectedRow.includes(fullId);
    };
    private selectRow = (node: NodeAccess, tabledata: TableRow) => {
        const fullId = this.appendNodeIdWithTableData(node, tabledata);
        const filteredIds = this.state.selectedRow.filter((id) => !id.startsWith(node.id));
        return [...filteredIds, fullId];
    };

    private onNodeChange = (node: NodeAccess, tabledata: TableRow) => {
        return () => {
            this.setState(
                {
                    selectedHeading: 0,
                    selectedRow: this.selectRow(node, tabledata),
                },
                () => {
                    this.populateData(this.props.nodes.slice());
                }
            );
        };
    };
    private onChangeHeading = (row: TableRow) => {
        return () => {
            const selectedIds = this.getFormattedNodeIds(row, this.props.nodes.slice());
            if (isEqual(this.state.selectedRow, selectedIds)) {
                this.setState({
                    selectedHeading: 0,
                    selectedRow: [],
                });
                return;
            }
            this.setState(
                {
                    selectedHeading: row.id,
                    selectedRow: selectedIds,
                },
                () => {
                    this.populateData(this.props.nodes.slice());
                }
            );
        };
    };

    private populateData(inputNodes: Array<NodeAccess>) {
        const nodes = inputNodes.map((node) => {
            const copy = { ...node };
            if (this.isConfigurable(copy)) {
                return copy;
            }
            if (copy.children && copy.children.length > 0) {
                copy.children = this.populateData(copy.children);
            }
            const selectedRow: string | undefined = this.state.selectedRow.find((n) => n.split('#')[0] === node.id);
            if (selectedRow) {
                const selectedData: Array<TableRow> = this.state.tableData.filter(
                    (tableRow) => tableRow.id === parseInt(selectedRow.split('#')[1], 10)
                );
                copy.access = selectedData[0].name;
            }
            return copy;
        });
        if (nodes.length > 0) {
            this.props.onNodesChange(nodes.slice());
        }
        return nodes;
    }

    private isConfigurable(copy: NodeAccess): boolean {
        return !copy.configurable;
    }

    private appendNodeIdWithTableData(node: NodeAccess, tabledata: TableRow): string {
        return node.id + '#' + tabledata.id;
    }

    private getFormattedNodeIds = (row: TableRow, nodes: Array<NodeAccess>): Array<string> => {
        const selectedNodes: Array<string> = [];
        for (const node of nodes) {
            if (this.isConfigurable(node)) {
                continue;
            }
            if (node.children && node.children.length > 0) {
                const childNodes = this.getFormattedNodeIds(row, node.children); // Recursively get child node ids
                selectedNodes.push(...childNodes);
            }
            selectedNodes.push(this.appendNodeIdWithTableData(node, row));
        }
        return selectedNodes;
    };

    private initNodeIds = (tableData: Array<TableRow>, nodes: Array<NodeAccess>): Array<string> => {
        const currentRow = tableData[0];
        const selectedNodes = [];

        for (const node of nodes) {
            const selectedDataHeading = tableData.filter((tableRow) => tableRow.name === node.access);
            const accessId = node.access ? selectedDataHeading[0].id : currentRow.id.toString();
            const nodeIds = [node.id + '#' + accessId];
            if (this.isConfigurable(node)) {
                continue;
            }
            if (node.children && node.children.length > 0) {
                const childNodes = this.initNodeIds(tableData, node.children);
                selectedNodes.push(...nodeIds, ...childNodes);
            } else {
                selectedNodes.push(...nodeIds);
            }
        }

        return selectedNodes;
    };
}

export default TableWithRadioButtons;
