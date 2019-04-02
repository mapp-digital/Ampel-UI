import * as React from 'react';
interface Props {
    id: string;
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
    className?: string;
}
declare const Checkbox: React.FunctionComponent<Props>;
export { Checkbox };
