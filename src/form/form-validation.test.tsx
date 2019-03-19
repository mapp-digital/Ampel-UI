import * as React from 'react';

import { cleanup, fireEvent, render, waitForElement } from '@config/testing';

import { ViolationSeverity } from '../api';
import { FieldType, Form, SectionType } from './form';
import { ConstraintLevels } from './types';

afterEach(cleanup);

describe('Form Validation', () => {
    it('should validate with custom validator', () => {
        const violationMessage = 'SomeViolationMessage';
        const constraints = {
            ERROR: {
                custom: [
                    (value: string) => {
                        const violation = {
                            message: violationMessage,
                            severity: ViolationSeverity.ERROR,
                        };
                        return Promise.resolve(value ? null : violation);
                    },
                ],
            },
        };
        const newInvalidValue = '';

        const assert = (violationTextNode: HTMLElement) => {
            expect(violationTextNode.textContent).toEqual(violationMessage);
        };

        return runTest(constraints, newInvalidValue, assert);
    });

    it('should validate min', () => {
        const constraints = {
            ERROR: {
                min: 3,
            },
        };
        const newInvalidValue = 'ab';

        const assert = (violationTextNode: HTMLElement) => {
            expect(violationTextNode.textContent).toEqual('should be greater than or equal 3');
        };

        return runTest(constraints, newInvalidValue, assert);
    });

    it('should validate max', () => {
        const constraints = {
            ERROR: {
                max: 3,
            },
        };
        const newInvalidValue = 'abcd';

        const assert = (violationTextNode: HTMLElement) => {
            expect(violationTextNode.textContent).toEqual('should be smaller than or equal 3');
        };

        return runTest(constraints, newInvalidValue, assert);
    });

    it('should validate required', () => {
        const constraints = {
            ERROR: {
                required: true,
            },
        };
        const newInvalidValue = '';

        const assert = (violationTextNode: HTMLElement) => {
            expect(violationTextNode.textContent).toEqual('is required');
        };

        return runTest(constraints, newInvalidValue, assert);
    });

    it('should validate email', () => {
        const constraints = {
            ERROR: {
                email: true,
            },
        };
        const newInvalidValue = 'bb@wt';

        const assert = (violationTextNode: HTMLElement) => {
            expect(violationTextNode.textContent).toEqual('is not valid email');
        };

        return runTest(constraints, newInvalidValue, assert);
    });

    it('should validate number', () => {
        const constraints = {
            ERROR: {},
        };
        const newInvalidValue = 'zer0';

        const assert = (violationTextNode: HTMLElement) => {
            expect(violationTextNode.textContent).toEqual('is not number');
        };

        return runTestWithNumber(constraints, newInvalidValue, assert);
    });

    it('should validate integer', () => {
        const constraints = {
            ERROR: {},
        };
        const newInvalidValue = '50.5';

        const assert = (violationTextNode: HTMLElement) => {
            expect(violationTextNode.textContent).toEqual('is not number');
        };

        return runTestWithInteger(constraints, newInvalidValue, assert);
    });

    it('should validate pattern', () => {
        const constraints = {
            ERROR: {
                pattern: new RegExp(/[a-zA-Z]+/),
            },
        };
        const newInvalidValue = '1234';

        const assert = (violationTextNode: HTMLElement) => {
            expect(violationTextNode.textContent).toEqual('contains illegal characters');
        };

        return runTest(constraints, newInvalidValue, assert);
    });
});

const runTest = (
    constraints: ConstraintLevels<any, any>,
    newInvalidValue: string,
    assert: (textNode: HTMLElement) => void
) => {
    const { getByDataQa, queryByDataQa } = createForm(constraints);

    triggerValidationOnName(getByDataQa, newInvalidValue);
    return waitForElement(() => queryByDataQa('violation--text-name')!).then((violationTextNode) => {
        assert(violationTextNode);
        expectErrorViolation(getByDataQa);
    });
};

const runTestWithNumber = (
    constraints: ConstraintLevels<any, any>,
    newInvalidValue: string,
    assert: (textNode: HTMLElement) => void
) => {
    const { getByDataQa, queryByDataQa } = createForm(constraints);

    triggerValidationOnAge(getByDataQa, newInvalidValue);
    return waitForElement(() => queryByDataQa('violation--text-age')!).then((violationTextNode) => {
        assert(violationTextNode);
        expectErrorViolation(getByDataQa);
    });
};

const runTestWithInteger = (
    constraints: ConstraintLevels<any, any>,
    newInvalidValue: string,
    assert: (textNode: HTMLElement) => void
) => {
    const { getByDataQa, queryByDataQa } = createForm(constraints);

    triggerValidationOnDays(getByDataQa, newInvalidValue);
    return waitForElement(() => queryByDataQa('violation--text-days')!).then((violationTextNode) => {
        assert(violationTextNode);
        expectErrorViolation(getByDataQa);
    });
};

const createFieldWithConstraint = (constraints: ConstraintLevels<string, any>) => {
    return [
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
                            label: 'Name',
                            type: FieldType.STRING,
                            constraints,
                        },
                        {
                            id: 'age',
                            label: 'Age',
                            type: FieldType.NUMBER,
                            constraints,
                        },
                        {
                            id: 'days',
                            label: 'Days',
                            type: FieldType.INTEGER,
                            constraints,
                        },
                    ],
                },
            ],
        },
    ];
};

const expectErrorViolation = (getByDataQa: (key: string) => HTMLElement) => {
    expect(getByDataQa('violation-component').classList.contains('error'));
};

const triggerValidationOnName = (getByDataQa: (key: string) => HTMLElement, value: string) => {
    const nameInput = getByDataQa('input--element-name');
    fireEvent.change(nameInput, { target: { value } });
};

const triggerValidationOnAge = (getByDataQa: (key: string) => HTMLElement, value: string) => {
    const nameInput = getByDataQa('input--element-age');
    fireEvent.change(nameInput, { target: { value } });
};

const triggerValidationOnDays = (getByDataQa: (key: string) => HTMLElement, value: string) => {
    const nameInput = getByDataQa('input--element-days');
    fireEvent.change(nameInput, { target: { value } });
};

const createForm = (constraints: ConstraintLevels<any, any>) => {
    return render(
        <Form
            model={{ name: 'name', age: 20, days: 10 }}
            onSubmit={jest.fn()}
            submitButtonText="Submit"
            cancelButtonText="Cancel"
        >
            {createFieldWithConstraint(constraints)}
        </Form>
    );
};
