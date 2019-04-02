import * as React from 'react';
interface Props {
    id: string;
    value: any;
    rows?: number;
    onBlur?: (event: React.FormEvent<HTMLTextAreaElement>) => void;
    onChange: (value: any) => void;
    className?: string;
    placeholder?: string;
}
declare const Textarea: React.FunctionComponent<Props>;
export { Textarea };
