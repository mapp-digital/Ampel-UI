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

const Toggle: React.FunctionComponent<Props> = (props) => {
    const toggleStateClass = props.value ? 'toggle-on' : 'toggle-off';
    const toggleHandler = () => !props.disabled && props.onChange(!props.value);
    return (
        <div>
            <button
                id={props.id}
                type="button"
                className="toggle"
                onClick={toggleHandler}
                disabled={props.disabled}
                data-qa={`toggle-${props.id}`}
            >
                <div
                    className={`toggle-container toggle-animate ${toggleStateClass}`}
                    data-qa={`toggle-container-${props.id}`}
                >
                    <span className="toggle-left">{props.onLabel}</span>
                    <span className="toggle-knob" />
                    <span className="toggle-right">{props.offLabel}</span>
                </div>
            </button>
            {props.description ? (<span className="toggle-description" data-qa={`toggle-${props.id}--description`}>{props.description}</span>) : null}
        </div>
    );
};

export { Toggle };
