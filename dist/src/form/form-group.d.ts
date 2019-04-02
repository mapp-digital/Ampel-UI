import * as React from 'react';
declare enum ValidityState {
    VALID = "VALID",
    ERROR = "ERROR",
    WARNING = "WARNING",
    UNCHANGED = "UNCHANGED"
}
interface Props {
    id: string;
    label: string;
    isExpanded: boolean;
    validityState: ValidityState;
    onClick: (groupId: string) => void;
}
declare const FormGroup: React.FunctionComponent<Props>;
export { FormGroup, ValidityState };
