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
    const toggleHandler = () => props.onChange(!props.value);
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
            <span className="toggle-description">{props.description || ''}</span>
        </div>
    );
};

export { Toggle };
