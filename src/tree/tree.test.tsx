import { Tree } from './';

import * as React from 'react';

import { cleanup, render } from '@config/testing';
import { COLLAPSED_CLASS, EXPANDED_CLASS, HIGHLIGHTED_CLASS } from './node';

afterEach(cleanup);

describe('Tree', () => {
    it('should not fail on empty collection', () => {
        render(<Tree nodes={[]} />);
    });

    it('should render flat list of nodes', () => {
        const firstLevelNodeLabel = '1';
        const secondLevelNodeLabel = '2';
        const nodes = [
            {
                id: '1',
                label: firstLevelNodeLabel,
                children: [],
            },
            {
                id: '2',
                label: secondLevelNodeLabel,
                children: [],
            },
        ];

        const { getByText } = render(<Tree nodes={nodes} />);

        expect(getByText(firstLevelNodeLabel)).toBeTruthy();
        expect(getByText(secondLevelNodeLabel)).toBeTruthy();
    });

    it('should render children if expanded', () => {
        const nestedChildLabel = '1-1-1';
        const nodes = [
            {
                id: '1',
                label: '1',
                isExpanded: true,
                children: [
                    {
                        id: '1-1',
                        label: '1-1',
                        isExpanded: true,
                        children: [
                            {
                                id: '1-1-1',
                                label: nestedChildLabel,
                                children: [],
                            },
                        ],
                    },
                ],
            },
        ];

        const { getByText } = render(<Tree nodes={nodes} />);

        const childElement = getByText(nestedChildLabel);
        expect(childElement).toBeTruthy();
    });

    it('should NOT render children if collapsed', () => {
        const parentLabel = '1';
        const nodes = [
            {
                id: '1',
                label: parentLabel,
                children: [
                    {
                        id: '1-1',
                        label: '1-1',
                        children: [],
                    },
                ],
            },
        ];

        const { getByText } = render(<Tree nodes={nodes} />);

        const parentNode = getByText(parentLabel);
        expect(parentNode.children.length).toBeLessThanOrEqual(0);
    });

    it('should NOT render children if collapsed', () => {
        const parentLabel = '1';
        const nodes = [
            {
                id: '1',
                label: parentLabel,
                children: [
                    {
                        id: '1-1',
                        label: '1-1',
                        children: [],
                    },
                ],
            },
        ];

        const { getByText } = render(<Tree nodes={nodes} />);

        const parentNode = getByText(parentLabel);
        expect(parentNode.children.length).toBeLessThanOrEqual(0);
    });

    it('should invoke `onClick` if given', () => {
        const nodeLabel = '1';
        const nodes = [
            {
                id: '1',
                label: nodeLabel,
                isExpanded: false,
                isHighlighted: false,
                children: [],
            },
        ];
        const onClick = jest.fn();

        const { getByText } = render(<Tree nodes={nodes} onNodeClick={onClick} />);

        const parentNode = getByText(nodeLabel);
        parentNode.click();
        expect(onClick).toHaveBeenCalledWith(nodes[0]);
    });

    it('should expand a nodes children on click and collapse on subsequent click', () => {
        const nodeLabel = '1';
        const childNodeLabel = '1-1';
        const nodes = [
            {
                id: '1',
                label: nodeLabel,
                children: [
                    {
                        id: '1-1',
                        label: childNodeLabel,
                    },
                ],
            },
        ];

        const { getByText, queryByText } = render(<Tree nodes={nodes} />);

        const parentNode = getByText(nodeLabel);
        expect(queryByText(childNodeLabel)).toBeFalsy();

        parentNode.click();
        expect(getByText(childNodeLabel)).toBeTruthy();

        parentNode.click();
        expect(queryByText(childNodeLabel)).toBeFalsy();
    });

    it('should highlight all parents of a highlighted node', () => {
        const firstLevelNodeId = '1';
        const secondLevelNodeId = '1-2';
        const targetNodeId = '1-2-2';
        const nodes = [
            {
                id: firstLevelNodeId,
                label: '1',
                children: [
                    {
                        id: '1-1',
                        label: '1-1',
                        children: [
                            {
                                id: '1-1-1',
                                label: '1-1-1',
                            },
                        ],
                    },
                    {
                        id: secondLevelNodeId,
                        label: '1-2',
                        children: [
                            {
                                id: '1-2-1',
                                label: '1-2-1',
                            },
                            {
                                id: targetNodeId,
                                label: '1-2-2',
                            },
                        ],
                    },
                ],
            },
        ];

        const { getByDataQa } = render(<Tree nodes={nodes} />);

        const firstLevelNode = getByDataQa('node-' + firstLevelNodeId);
        firstLevelNode.click();

        const secondLevelNode = getByDataQa('node-' + secondLevelNodeId);
        secondLevelNode.click();

        const targetNode = getByDataQa('node-' + targetNodeId);
        targetNode.click();

        expect(targetNode.classList.contains(HIGHLIGHTED_CLASS)).toBeTruthy();
        expect(secondLevelNode.classList.contains(HIGHLIGHTED_CLASS)).toBeTruthy();
        expect(firstLevelNode.classList.contains(HIGHLIGHTED_CLASS)).toBeTruthy();
    });

    it('should collapse all siblings and their children when expanding a node', () => {
        const toBeExpandedNodeId = '1-2';
        const previouslyExpandedNodeId = '1-1';
        const nodes = [
            {
                id: '1',
                label: '1',
                isExpanded: true,
                children: [
                    {
                        id: previouslyExpandedNodeId,
                        label: '1-1',
                        isExpanded: true,
                        children: [
                            {
                                id: '1-1-1',
                                label: '1-1-1',
                            },
                        ],
                    },
                    {
                        id: toBeExpandedNodeId,
                        label: '1-2',
                        children: [
                            {
                                id: '1-2-1',
                                label: '1-2-1',
                            },
                        ],
                    },
                ],
            },
        ];

        const { getByDataQa } = render(<Tree nodes={nodes} />);

        const previouslyExpandedNodeIcon = getByDataQa('node--icon-' + previouslyExpandedNodeId);
        const toBeExpandedNodeIcon = getByDataQa('node--icon-' + toBeExpandedNodeId);
        toBeExpandedNodeIcon.click();

        expect(previouslyExpandedNodeIcon.classList.contains(COLLAPSED_CLASS)).toBeTruthy();
        expect(toBeExpandedNodeIcon.classList.contains(EXPANDED_CLASS)).toBeTruthy();
    });

    it('should highlight target node and highlight parents when set from outside', () => {
        const targetNodeId = '1-1-2';
        const nodes = [
            {
                id: '1',
                label: '1',
                children: [
                    {
                        id: '1-1',
                        label: '1-1',
                        children: [
                            {
                                id: '1-1-1',
                                label: '1-1-1',
                            },
                            {
                                id: targetNodeId,
                                label: '1-1-2',
                            },
                        ],
                    },
                ],
            },
        ];

        const { queryByDataQa, getByDataQa, rerender } = render(<Tree nodes={nodes} />);
        const absentTargetNode = queryByDataQa('node-' + targetNodeId);

        expect(absentTargetNode).toBeFalsy();

        rerender(<Tree nodes={nodes} highlightedNodeId={targetNodeId} />);
        const targetNode = getByDataQa('node-' + targetNodeId);

        expect(targetNode.classList.contains(HIGHLIGHTED_CLASS)).toBeTruthy();
    });
});
