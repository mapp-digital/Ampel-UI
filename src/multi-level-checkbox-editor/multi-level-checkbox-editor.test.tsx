import * as React from 'react';

import { cleanup, render } from '@config/testing';
import { MultiLevelCheckboxEditor, MultiLevelCheckboxEditorProps } from './multi-level-checkbox-editor';
import { getAggregateState } from './node-box';
import { TriStateCheckboxState } from './tri-state-checkbox';

const getMultiLevelCheckboxEditor = (props: MultiLevelCheckboxEditorProps) => <MultiLevelCheckboxEditor {...props} />;
const defaultProps = {
    onNodesChange: jest.fn(),
    levelHeaderLabels: ['Level 1', 'Level 2'],
};

describe('MultiLevelCheckboxEditor', () => {
    afterEach(cleanup);

    it('should exist', () => {
        const id = 'someId';
        const nodes = [
            {
                id: '1',
                label: 'Label 1',
                value: true,
                children: [
                    {
                        id: '1-1',
                        label: 'Label 1-1',
                        value: true,
                        children: [],
                    },
                    {
                        id: '1-2',
                        label: 'Label 1-2',
                        value: true,
                        children: [],
                    },
                ],
            },
            {
                id: '2',
                label: 'Label 2',
                value: false,
                children: [],
            },
        ];
        const { queryByDataQa } = render(getMultiLevelCheckboxEditor({ ...defaultProps, id, nodes }));
        const component = queryByDataQa(`multi-level-checkbox-editor-${id}`);
        expect(component).toBeTruthy();
    });

    it('should render header label', () => {
        const id = 'someId';
        const nodes = [
            {
                id: '1',
                label: 'Label 1',
                value: true,
            },
        ];
        const level1HeaderLabel = 'Level 1';
        const levelHeaderLabels = [level1HeaderLabel];
        const { getByDataQa } = render(getMultiLevelCheckboxEditor({ ...defaultProps, id, nodes, levelHeaderLabels }));
        const label = getByDataQa(`header-label-0`);
        expect(label.textContent).toBe(level1HeaderLabel);
    });

    it(`should invoke 'onNodesChange' with the particular node change, when a checkbox is clicked`, () => {
        const id = 'someId';
        const nodes = [
            {
                id: '1',
                label: 'Label 1',
                value: true,
            },
        ];
        const onNodesChange = jest.fn();
        const { getByDataQa } = render(getMultiLevelCheckboxEditor({ ...defaultProps, id, nodes, onNodesChange }));
        const checkbox = getByDataQa(`checkbox-node-1`) as HTMLInputElement;

        checkbox.click();

        expect(onNodesChange).toHaveBeenCalledWith([
            {
                id: '1',
                label: 'Label 1',
                value: false,
                isHighlighted: false,
            },
        ]);
    });

    it(`should invoke 'onNodesChange' with all nodes changed, when 'select-all' is clicked`, () => {
        const id = 'someId';
        const nodes = [
            {
                id: '1',
                label: 'Label 1',
                value: false,
            },
            {
                id: '2',
                label: 'Label 2',
                value: false,
            },
        ];
        const onNodesChange = jest.fn();
        const { getByDataQa } = render(getMultiLevelCheckboxEditor({ ...defaultProps, id, nodes, onNodesChange }));
        const checkbox = getByDataQa(`checkbox-select-all-0`) as HTMLInputElement;

        checkbox.click();

        expect(onNodesChange).toHaveBeenCalledWith([
            {
                id: '1',
                label: 'Label 1',
                value: true,
                isHighlighted: false,
            },
            {
                id: '2',
                label: 'Label 2',
                value: true,
                isHighlighted: false,
            },
        ]);
    });

    it(`should show a second box when an element of the first box is clicked`, () => {
        const id = 'someId';
        const label = 'Label 1';
        const nodes = [
            {
                id: '1',
                label,
                value: true,
                children: [
                    {
                        id: '1-1',
                        label: 'Label 1-1',
                        value: true,
                    },
                ],
            },
        ];
        const { getByDataQa } = render(getMultiLevelCheckboxEditor({ ...defaultProps, id, nodes }));
        const parentNode = getByDataQa(`node-${label}`);

        parentNode.click();

        const container = getByDataQa(`container-Level 1`);
        expect(container).toBeTruthy();
    });

    it(`should set the new value for all children when a parent node is clicked`, () => {
        const id = 'someId';
        const nodeId = '1';
        const nodes = [
            {
                id: nodeId,
                label: 'Label 1',
                value: true,
                children: [
                    {
                        id: '1-1',
                        label: 'Label 1-1',
                        value: true,
                        children: [],
                    },
                    {
                        id: '1-2',
                        label: 'Label 1-2',
                        value: true,
                        children: [],
                    },
                ],
            },
        ];
        const onNodesChange = jest.fn();
        const { getByDataQa } = render(getMultiLevelCheckboxEditor({ ...defaultProps, id, nodes, onNodesChange }));
        const parentNodeCheckbox = getByDataQa(`checkbox-node-${nodeId}`);

        parentNodeCheckbox.click();

        expect(onNodesChange).toHaveBeenCalledWith([
            {
                id: nodeId,
                label: 'Label 1',
                value: false,
                isHighlighted: false,
                children: [
                    {
                        id: '1-1',
                        label: 'Label 1-1',
                        value: false,
                        children: [],
                        isHighlighted: false,
                    },
                    {
                        id: '1-2',
                        label: 'Label 1-2',
                        value: false,
                        children: [],
                        isHighlighted: false,
                    },
                ],
            },
        ]);
    });

    it('should render search input', () => {
        const id = 'someId';
        const nodes = [
            {
                id: '1',
                label: 'Label 1',
                value: true,
                children: [
                    {
                        id: '1-1',
                        label: 'Label 1-1',
                        value: true,
                        children: [],
                    },
                    {
                        id: '1-2',
                        label: 'Label 1-2',
                        value: true,
                        children: [],
                    },
                ],
            },
            {
                id: '2',
                label: 'Label 2',
                value: false,
                children: [],
            },
        ];
        const searchPlaceholder = 'Search';
        const { queryByDataQa } = render(
            getMultiLevelCheckboxEditor({ ...defaultProps, id, nodes, searchPlaceholder })
        );

        const searchComponent = queryByDataQa(`multi-level-checkbox-editor-filter`);
        expect(searchComponent).toBeTruthy();
    });
});

const createNode = (value: boolean) => {
    return { id: '', label: '', value };
};

describe('getCheckboxState', () => {
    afterEach(cleanup);

    describe('given flat list', () => {
        it('should return CHECKED when all values are true', () => {
            const values = [true, true, true];

            const checkboxState = getAggregateState(values.map(createNode));

            expect(checkboxState).toBe(TriStateCheckboxState.CHECKED);
        });

        it('should return UNCHECKED when all values are false', () => {
            const values = [false, false, false];

            const checkboxState = getAggregateState(values.map(createNode));

            expect(checkboxState).toBe(TriStateCheckboxState.UNCHECKED);
        });

        it('should return INDETERMINATE when values mixed', () => {
            const values = [false, true, false];

            const checkboxState = getAggregateState(values.map(createNode));

            expect(checkboxState).toBe(TriStateCheckboxState.INDETERMINATE);
        });

        it('should return INDETERMINATE when all nested values are mixed', () => {
            const checkboxState = getAggregateState([
                {
                    id: '1',
                    label: '',
                    children: [
                        {
                            id: '1-1',
                            label: '',
                            children: [
                                {
                                    id: '',
                                    label: '',
                                    value: false,
                                    children: [],
                                },
                                {
                                    id: '',
                                    label: '',
                                    value: true,
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ]);

            expect(checkboxState).toBe(TriStateCheckboxState.INDETERMINATE);
        });

        it('should return CHECKED when all nested values are true', () => {
            const checkboxState = getAggregateState([
                {
                    id: '1',
                    label: '',
                    children: [
                        {
                            id: '1-1',
                            label: '',
                            children: [
                                {
                                    id: '',
                                    label: '',
                                    value: true,
                                    children: [],
                                },
                                {
                                    id: '',
                                    label: '',
                                    value: true,
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ]);

            expect(checkboxState).toBe(TriStateCheckboxState.CHECKED);
        });

        it('should return UNCHECKED when all nested values are false', () => {
            const checkboxState = getAggregateState([
                {
                    id: '1',
                    label: '',
                    children: [
                        {
                            id: '1-1',
                            label: '',
                            children: [
                                {
                                    id: '',
                                    label: '',
                                    children: [],
                                },
                                {
                                    id: '',
                                    label: '',
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ]);

            expect(checkboxState).toBe(TriStateCheckboxState.UNCHECKED);
        });

        it('should return INDETERMINATE when all nested values are mixed on different levels', () => {
            const checkboxState = getAggregateState([
                {
                    id: '1',
                    label: '',
                    value: true,
                    children: [
                        {
                            id: '1-1',
                            label: '',
                            value: true,
                            children: [],
                        },
                        {
                            id: '1-2',
                            label: '',
                            value: true,
                            children: [
                                {
                                    id: '1-2-1',
                                    label: '',
                                    value: false,
                                    children: [],
                                },
                                {
                                    id: '1-2-2',
                                    label: '',
                                    value: false,
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ]);

            expect(checkboxState).toBe(TriStateCheckboxState.INDETERMINATE);
        });
    });
});
