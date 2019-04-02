import * as React from 'react';
interface Props {
    id: string;
    value: boolean;
    disabled?: boolean;
    onLabel?: string;
    offLabel?: string;
    description?: string;
    onChange: (newValue: boolean) => void;
}
declare const Toggle: React.FunctionComponent<Props>;
export { Toggle };
