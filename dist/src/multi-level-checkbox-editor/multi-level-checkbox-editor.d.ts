import * as React from 'react';
import { BaseNode } from '../api/tree';
interface Node extends BaseNode<Node, boolean> {
}
interface Props {
    id: string;
    nodes: Array<Node>;
    onNodesChange: (nodes: Array<Node>) => void;
    selectAllLabel: string;
    levelHeaderLabels: Array<string>;
}
interface State {
    selectedNodeIds: Array<string>;
}
declare class MultiLevelCheckboxEditor extends React.Component<Props, State> {
    constructor(props: Props);
    render(): JSX.Element;
    private getNodes;
    private getSyntheticRootNode;
    private selectNode;
    private setNodeValue;
    private setValueRecursively;
    private createSetValueWalker;
    private findNode;
}
export { MultiLevelCheckboxEditor, Node, Props as MultiLevelCheckboxEditorProps };
