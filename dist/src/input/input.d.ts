import * as React from 'react';
interface Props {
    id: string;
    value: any;
    onBlur?: (event: React.FormEvent<HTMLInputElement>) => void;
    append?: string;
    prepend?: string;
    onChange: (value: any) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
    autoFocus?: boolean;
}
declare const Input: React.FunctionComponent<Props>;
export { Input };
