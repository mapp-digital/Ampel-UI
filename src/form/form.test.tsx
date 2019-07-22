import * as React from 'react';

import { cleanup, fireEvent, render, wait } from '@config/testing';

import { modelWithViolations, ViolationSeverity } from '../api';
import { FieldContext, FieldType, Form, SectionType } from './form';
import { Field } from './types';

afterEach(cleanup);

describe('Form', () => {
    it('should handle changes to a single string field', () => {
        const onSubmit = jest.fn().mockResolvedValue({});
        const { getByText, getByLabelText } = render(
            <Form model={{ name: 'name' }} onSubmit={onSubmit} submitButtonText="Submit" cancelButtonText="Cancel">
                {[
                    {
                        id: 'groupA',
                        label: 'Group A',
                        sections: [
                            {
                                id: 'section A',
                                type: SectionType.ONE_COLUMN,
                                fields: [
                                    {
                                        id: 'name',
                                        label: 'Name Tooltip',
                                        type: FieldType.STRING,
                                    },
                                ],
                            },
                        ],
                    },
                ]}
            </Form>
        );

        const nameInput = getByLabelText('Name Tooltip');

        const name = 'Egon';
        changeValue(nameInput, name);

        const submitButton = getByText('Submit');
        submitButton.click();

        return wait().then(() => {
            expect(onSubmit).toHaveBeenNthCalledWith(1, modelWithViolations({ name }, { name: [] }));
        });
    });

    it('should support nested object lookups', () => {
        const onSubmit = jest.fn().mockResolvedValue({});
        const model = {
            person: {
                name: 'John',
                age: 20,
            },
        };

        const { getByText, getByLabelText } = render(
            <Form model={model} onSubmit={onSubmit} submitButtonText="Submit" cancelButtonText="Cancel">
                {[
                    {
                        id: 'groupA',
                        label: 'Group A',
                        sections: [
                            {
                                id: 'section A',
                                type: SectionType.ONE_COLUMN,
                                fields: [
                                    {
                                        id: 'person.name',
                                        label: 'Name Label',
                                        type: FieldType.STRING,
                                    },
                                ],
                            },
                        ],
                    },
                ]}
            </Form>
        );

        const nameInput = getByLabelText('Name Label');
        const name = 'None';
        changeValue(nameInput, name);

        const submitButton = getByText('Submit');
        submitButton.click();

        return wait().then(() => {
            expect(onSubmit).toHaveBeenCalledWith(modelWithViolations({ person: { name } }, { 'person.name': [] }));
        });
    });

    it('should render and apply changes to custom rendered field', () => {
        const CustomEssayEditor: React.FunctionComponent<FieldContext<string> & { field: Field<string, any> }> = (
            props
        ) => {
            const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => props.setValue(event.target.value);
            return (
                <div>
                    <label htmlFor={props.field.id}>{props.field.label}</label>
                    <textarea id={props.field.id} value={props.value} onChange={onChange} />
                </div>
            );
        };

        const onSubmit = jest.fn().mockResolvedValue({});
        const { getByText, getByLabelText } = render(
            <Form model={{ essay: 'empty' }} onSubmit={onSubmit} submitButtonText="Submit" cancelButtonText="Cancel">
                {[
                    {
                        id: 'groupA',
                        label: 'Group A',
                        sections: [
                            {
                                id: 'section A',
                                type: SectionType.ONE_COLUMN,
                                fields: [
                                    {
                                        id: 'essay',
                                        type: FieldType.STRING,
                                        label: 'An Essay',
                                        render: (context: FieldContext<string>, field: Field<string, any>) => {
                                            return <CustomEssayEditor key={field.id} field={field} {...context} />;
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ]}
            </Form>
        );

        const essayTextarea = getByLabelText('An Essay');

        const essay = 'This\nis some very\nfancy text.';
        changeValue(essayTextarea, essay);

        const submitButton = getByText('Submit');
        submitButton.click();

        return wait().then(() => {
            expect(onSubmit).toHaveBeenNthCalledWith(1, modelWithViolations({ essay }, { essay: [] }));
        });
    });
});

describe('FormGroup', () => {
    it('should exist', () => {
        const groupId = 'groupA';
        const { queryByDataQa } = render(
            <Form model={{ name: 'name' }} onSubmit={jest.fn()} submitButtonText="Submit" cancelButtonText="Cancel">
                {[
                    {
                        id: groupId,
                        label: 'Group A',
                        sections: [
                            {
                                id: 'section A',
                                type: SectionType.ONE_COLUMN,
                                fields: [
                                    {
                                        id: 'name',
                                        label: 'Name Tooltip',
                                        type: FieldType.STRING,
                                    },
                                ],
                            },
                        ],
                    },
                ]}
            </Form>
        );

        const groupElement = queryByDataQa(`form-group-${groupId}`);

        expect(groupElement).toBeTruthy();
    });

    it('should initially expand the first group only', () => {
        const firstGroupContent = 'firstGroupContent';
        const secondGroupContent = 'secondGroupContent';
        const { queryByText } = render(
            <Form
                model={{ fieldA: 'fieldA', fieldB: 'fieldB' }}
                onSubmit={jest.fn()}
                submitButtonText="Submit"
                cancelButtonText="Cancel"
            >
                {[
                    getGroupWithRenderElement('groupA', () => <span key="key1">{firstGroupContent}</span>),
                    getGroupWithRenderElement('groupB', () => <span key="key2">{secondGroupContent}</span>),
                ]}
            </Form>
        );

        const firstGroupElement = queryByText(firstGroupContent);
        const secondGroupElement = queryByText(secondGroupContent);

        expect(firstGroupElement).toBeTruthy();
        expect(secondGroupElement).toBeFalsy();
    });

    it('should have both formGroups expanded at the time', () => {
        const firstGroupContent = 'firstGroupContent';
        const secondGroupContent = 'secondGroupContent';
        const expandedTargetGroupId = 'groupB';
        const { queryByText, getByDataQa } = render(
            <Form
                model={{ fieldA: 'fieldA', fieldB: 'fieldB' }}
                onSubmit={jest.fn()}
                submitButtonText="Submit"
                cancelButtonText="Cancel"
            >
                {[
                    getGroupWithRenderElement('groupA', () => <span key="key1">{firstGroupContent}</span>),
                    getGroupWithRenderElement(expandedTargetGroupId, () => (
                        <span key="key2">{secondGroupContent}</span>
                    )),
                ]}
            </Form>
        );
        const toBeExpandedGroupButton = getByDataQa(`form-group--toggle-${expandedTargetGroupId}`);
        toBeExpandedGroupButton.click();

        const firstGroupElement = queryByText(firstGroupContent);
        const secondGroupElement = queryByText(secondGroupContent);

        expect(firstGroupElement).toBeTruthy();
        expect(secondGroupElement).toBeTruthy();
    });

    it('should initially expand the first group only', () => {
        const firstGroupContent = 'firstGroupContent';
        const secondGroupContent = 'secondGroupContent';
        const targetExpandedGroupId = 'groupA';
        const { queryByText, getByDataQa } = render(
            <Form
                model={{ fieldA: 'fieldA', fieldB: 'fieldB' }}
                onSubmit={jest.fn()}
                submitButtonText="Submit"
                cancelButtonText="Cancel"
            >
                {[
                    getGroupWithRenderElement(targetExpandedGroupId, () => <span key="key1">{firstGroupContent}</span>),
                    getGroupWithRenderElement('groupB', () => <span key="key2">{secondGroupContent}</span>),
                ]}
            </Form>
        );
        const toBeExpandedGroupButton = getByDataQa(`form-group--toggle-${targetExpandedGroupId}`);
        toBeExpandedGroupButton.click();

        const firstGroupElement = queryByText(firstGroupContent);
        const secondGroupElement = queryByText(secondGroupContent);

        expect(firstGroupElement).toBeFalsy();
        expect(secondGroupElement).toBeFalsy();
    });

    it(`should add class 'group-unchanged' when form is not dirty`, () => {
        const groupId = 'groupA';
        const { getByDataQa } = render(
            <Form model={{ fieldA: 'fieldA' }} onSubmit={jest.fn()} submitButtonText="Submit" cancelButtonText="Cancel">
                {[getGroupWithRenderElement(groupId, () => <span key="key1" />)]}
            </Form>
        );

        const groupElement = getByDataQa(`form-group-${groupId}`);

        expect(groupElement.classList.contains('group-unchanged')).toBeTruthy();
    });

    it(`should add class 'group-error' when any field of the group is erroneous`, () => {
        const groupId = 'groupA';
        const someViolation = {
            severity: ViolationSeverity.ERROR,
            message: 'someError',
        };
        const { getByDataQa } = render(
            <Form
                model={{ fieldA: 'fieldA' }}
                violations={{ fieldA: [someViolation] }}
                onSubmit={jest.fn()}
                submitButtonText="Submit"
                cancelButtonText="Cancel"
            >
                {[getGroupWithRenderElement(groupId, () => <span key="key1" />)]}
            </Form>
        );

        const groupElement = getByDataQa(`form-group-${groupId}`);

        expect(groupElement.classList.contains('group-error')).toBeTruthy();
    });

    it(`should add class 'group-warning' when any field of the group has warning but none errors`, () => {
        const groupId = 'groupA';
        const someViolation = {
            severity: ViolationSeverity.WARNING,
            message: 'someError',
        };
        const { getByDataQa } = render(
            <Form
                model={{ fieldA: 'fieldA' }}
                violations={{ fieldA: [someViolation] }}
                onSubmit={jest.fn()}
                submitButtonText="Submit"
                cancelButtonText="Cancel"
            >
                {[getGroupWithRenderElement(groupId, () => <span key="key1" />)]}
            </Form>
        );

        const groupElement = getByDataQa(`form-group-${groupId}`);

        expect(groupElement.classList.contains('group-warning')).toBeTruthy();
    });

    it(`should add class 'group-valid' if there are changes and all fields are valid`, () => {
        const groupId = 'groupA';
        const fieldId = 'fieldA';
        const { getByDataQa } = render(
            <Form model={{ fieldA: 'fieldA' }} onSubmit={jest.fn()} submitButtonText="Submit" cancelButtonText="Cancel">
                {[getGroupWithDefaultField(groupId, fieldId)]}
            </Form>
        );

        const fieldElement = getByDataQa(`input--element-${fieldId}`);
        changeValue(fieldElement, 'somethingValid');

        const groupElement = getByDataQa(`form-group-${groupId}`);
        expect(groupElement.classList.contains('group-valid')).toBeTruthy();
    });

    it(`should work with two or more distinct groups that don't interfere`, () => {
        const groupIdA = 'groupA';
        const groupIdB = 'groupB';
        const fieldIdB = 'fieldB';
        const someError = {
            severity: ViolationSeverity.ERROR,
            message: 'someError',
        };
        const { getByDataQa } = render(
            <Form
                model={{ fieldA: 0, fieldB: 'fieldB' }}
                violations={{ fieldA: [someError] }}
                validationOptions={{ delayMillis: 0 }}
                onSubmit={jest.fn()}
                submitButtonText="Submit"
                cancelButtonText="Cancel"
            >
                {[
                    {
                        id: groupIdA,
                        label: 'Group A',
                        sections: [
                            {
                                id: 'section A',
                                type: SectionType.ONE_COLUMN,
                                fields: [
                                    {
                                        id: 'fieldA',
                                        label: 'String Field',
                                        type: FieldType.NUMBER,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: groupIdB,
                        label: 'Group B',
                        sections: [
                            {
                                id: 'section B',
                                type: SectionType.ONE_COLUMN,
                                fields: [
                                    {
                                        id: fieldIdB,
                                        label: 'Number Field',
                                        type: FieldType.STRING,
                                    },
                                ],
                            },
                        ],
                    },
                ]}
            </Form>
        );

        const groupElementA = getByDataQa(`form-group-${groupIdA}`);
        const groupElementB = getByDataQa(`form-group-${groupIdB}`);

        const groupsToggleB = getByDataQa(`form-group--toggle-${groupIdB}`);
        groupsToggleB.click();

        const fieldElement = getByDataQa(`input--element-${fieldIdB}`);
        changeValue(fieldElement, 'valid');

        expect(groupElementA.classList.contains('group-error')).toBeTruthy();
        expect(groupElementB.classList.contains('group-valid')).toBeTruthy();
    });
});

const changeValue = (node: HTMLElement, value: string) => {
    fireEvent.change(node, { target: { value } });
};

const getGroupWithDefaultField = (groupId: string, fieldId: string) => {
    return {
        id: groupId,
        label: 'Group A',
        sections: [
            {
                id: 'section A',
                type: SectionType.ONE_COLUMN,
                fields: [
                    {
                        id: fieldId,
                        label: 'Name',
                        type: FieldType.STRING,
                    },
                ],
            },
        ],
    };
};

const getGroupWithRenderElement = (id: string, createNode: () => React.ReactNode) => {
    return {
        id,
        label: 'Group A',
        sections: [
            {
                id: 'sectionA',
                type: SectionType.ONE_COLUMN,
                fields: [
                    {
                        id: 'fieldA',
                        type: FieldType.STRING,
                        label: 'label A',
                        render: createNode,
                    },
                ],
            },
        ],
    };
};
