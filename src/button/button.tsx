import * as React from 'react';

type ButtonType = 'reset' | 'submit' | 'button';

interface Props {
    id: string;
    text: string;
    type?: ButtonType;
    onClick?: (event: React.MouseEvent) => void;
    disabled?: boolean;
    className?: string;
}

const Button: React.FunctionComponent<Props> = (props: Props) => {
    return (
        <button
            type={props.type || 'button'}
            onClick={props.onClick}
            data-qa={`button-${props.id}`}
            disabled={props.disabled}
            className={props.className}
        >
            {props.text}
        </button>
    );
};

export { Button };
