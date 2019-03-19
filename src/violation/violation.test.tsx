import * as React from 'react';

import { cleanup, render } from '../../config/testing';

import { ConstraintViolation, ViolationSeverity } from '../api/index';
import { Violation } from './index';

describe('Violation', () => {
    afterEach(cleanup);

    it('should be empty if no violations passed', () => {
        const id = 'someId';
        const emptyViolations: Array<ConstraintViolation> = [];

        const { queryByDataQa } = render(<Violation id={id} violations={emptyViolations} />);

        const violationMessage = queryByDataQa('violation--text-' + id);
        expect(violationMessage).toBeFalsy();
    });

    it('should show the message of a single violation', () => {
        const id = 'someId';
        const infoMessage = 'someInfo';
        const violations: Array<ConstraintViolation> = [
            {
                severity: ViolationSeverity.INFO,
                message: infoMessage,
            },
        ];

        const { getByDataQa } = render(<Violation id={id} violations={violations} />);

        const violationContainer = getByDataQa('violation-component');
        expect(violationContainer.className.includes('info')).toBeTruthy();
        const violationMessage = getByDataQa('violation--text-' + id);
        expect(violationMessage.textContent).toEqual(infoMessage);
    });

    it('should show the message of the entry with the highest severity', () => {
        const id = 'someId';
        const errorMessage = 'someError';
        const violations: Array<ConstraintViolation> = [
            {
                severity: ViolationSeverity.ERROR,
                message: errorMessage,
            },
            {
                severity: ViolationSeverity.WARNING,
                message: 'someWarning',
            },
        ];

        const { getByDataQa } = render(<Violation id={id} violations={violations} />);

        const violationContainer = getByDataQa('violation-component');
        expect(violationContainer.className.includes('error')).toBeTruthy();
        const violationMessage = getByDataQa('violation--text-' + id);
        expect(violationMessage.textContent).toEqual(errorMessage);
    });
});
