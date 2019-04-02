import * as React from 'react';
interface Props {
    id: string;
    text: string;
    type?: string;
    onClick?: (event: React.MouseEvent) => void;
    disabled?: boolean;
    className?: string;
}
declare const Button: React.FunctionComponent<Props>;
export { Button };
