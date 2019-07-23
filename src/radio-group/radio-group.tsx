import * as React from 'react';

import { Option } from '../select';

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
                <div key={index} className={`${props.className || ''}`}>
                    <label className="radio">
                        <span>{option.label}</span>
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
                        <span className="checkmark" />
                    </label>
                </div>
            ))}
        </>
    );
};

export { RadioGroup };
