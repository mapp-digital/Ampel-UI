import * as React from 'react';

import { Label } from '../label/';
import { getClassByViolations, Violation } from '../violation/';
import { ConstraintViolation } from './types';

interface Props {
    id: string;
    label: string;
    required?: boolean;
    violations: Array<ConstraintViolation>;
    align?: 'top' | 'bottom';
    hidden?: boolean;
}

const FormField: React.FunctionComponent<Props> = (props) => {
    const violationClass = getClassByViolations(props.violations);
    const labelRequiredAppend = props.required ? '*' : '';
    if (props.hidden) {
        return null;
    }
    return (
        <div className={`row form-group ${props.align || `middle`}-xs`}>
            <div className={`col-xs-2 form-label-container ${violationClass}`}>
                <Label value={props.label} append={labelRequiredAppend} for={props.id} />
            </div>
            <div className={`col-xs-5 ${violationClass}`}>{props.children}</div>
            <div className={`col-xs-5 ${violationClass}`}>
                <Violation id={props.id} violations={props.violations} />
            </div>
        </div>
    );
};

export { FormField };
