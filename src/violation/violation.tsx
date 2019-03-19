import * as React from 'react';

import { ConstraintViolation, ViolationSeverity } from '../api/index';

interface Props {
    id: string;
    className?: string;
    violations: Array<ConstraintViolation>;
}

const severityOrder = [ViolationSeverity.ERROR, ViolationSeverity.WARNING, ViolationSeverity.INFO];

const hasViolationWithSeverity = (violations: Array<ConstraintViolation>, severity: ViolationSeverity) => {
    return violations.some((violation) => violation.severity === severity);
};

const getClassByViolations = (violations: Array<ConstraintViolation>) => {
    const highestSeverity = severityOrder.find((severity) => {
        return hasViolationWithSeverity(violations, severity);
    });

    return (highestSeverity && highestSeverity.toLocaleLowerCase()) || '';
};

const Violation: React.FunctionComponent<Props> = (props) => {
    const message = props.violations[0] && props.violations[0].message;
    const className = getClassByViolations(props.violations) + (props.className || '');
    return (
        <div className={`violation ${className}`} data-qa="violation-component">
            {message && (
                <>
                    <span className="violation-icon" data-qa="violation--icon" />
                    <span className="violation-text" data-qa={`violation--text-${props.id}`}>
                        {message}
                    </span>
                </>
            )}
        </div>
    );
};

export { getClassByViolations, Violation };
