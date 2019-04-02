import * as React from 'react';
import { ConstraintViolation } from '../api/index';
interface Props {
    id: string;
    className?: string;
    violations: Array<ConstraintViolation>;
}
declare const getClassByViolations: (violations: ConstraintViolation[]) => string;
declare const Violation: React.FunctionComponent<Props>;
export { getClassByViolations, Violation };
