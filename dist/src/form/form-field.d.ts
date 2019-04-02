import * as React from 'react';
import { ConstraintViolation } from './types';
interface Props {
    id: string;
    label: string;
    required?: boolean;
    violations: Array<ConstraintViolation>;
    align?: 'top' | 'bottom';
    hidden?: boolean;
}
declare const FormField: React.FunctionComponent<Props>;
export { FormField };
