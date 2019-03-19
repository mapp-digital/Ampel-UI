import { BaseNode } from '../api/tree';

export interface INode extends BaseNode<INode, never> {
    isExpanded?: boolean;
}
