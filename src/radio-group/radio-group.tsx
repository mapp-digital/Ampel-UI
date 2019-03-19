import * as React from 'react';

import { Option } from '@ampel-ui/select';

interface Props {
    id: string;
    name: string;
    value: any;
    className?: string;
    options: Array<Option<any>>;
    onChange: (value: any) => void;
}

const RadioGroup: React.FunctionComponent<Props> = (props) => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(event.currentTarget.value);
    };
    return (
        <>
            {props.options.map((option, index) => (
                <div className={`radio ${props.className || ''}`} key={index}>
                    <input
                        id={`${props.id}-${index}`}
                        type="radio"
                        name={props.name}
                        value={option.value}
                        aria-checked={option.value === props.value}
                        checked={option.value === props.value}
                        onChange={onChange}
                        data-qa={`radio-${props.id}-${index}`}
                    />
                    <label htmlFor={props.id}>{option.label}</label>
                </div>
            ))}
        </>
    );
};

export { RadioGroup };
