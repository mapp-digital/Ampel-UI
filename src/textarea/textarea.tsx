import * as React from 'react';

interface Props {
    id: string;
    value: any;
    rows?: number;
    onBlur?: (event: React.FormEvent<HTMLTextAreaElement>) => void;
    onChange: (value: any) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

const Textarea: React.FunctionComponent<Props> = (props) => {
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => props.onChange(event.target.value);
    return (
        <div className="textarea-component">
            <textarea
                id={props.id}
                className={`form-control ${props.className || ''}`}
                rows={props.rows || 3}
                onBlur={props.onBlur}
                onChange={onChange}
                placeholder={props.placeholder}
                data-qa={`textarea--element-${props.id}`}
                value={props.value}
                disabled={props.disabled}
            />
        </div>
    );
};

export { Textarea };
