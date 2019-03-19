import * as React from 'react';

enum ValidityState {
    VALID = 'VALID',
    ERROR = 'ERROR',
    WARNING = 'WARNING',
    UNCHANGED = 'UNCHANGED',
}

interface Props {
    id: string;
    label: string;
    isExpanded: boolean;
    validityState: ValidityState;
    onClick: (groupId: string) => void;
}

const getClass = (props: Props) => {
    const expanded = props.isExpanded ? 'expanded' : '';
    return `form-group-accordion group-${props.validityState.toLowerCase()} ${expanded}`;
};

const FormGroup: React.FunctionComponent<Props> = (props) => {
    // TODO: useCallback ASAP.
    const onClick = () => props.onClick(props.id);
    return (
        <div className={getClass(props)} data-qa={`form-group-${props.id}`}>
            <span className="form-group-icon" />
            <div className="form-group-wrap">
                <div className="form-group-header">
                    <button
                        type="button"
                        onClick={onClick}
                        data-qa={`form-group--toggle-${props.id}`}
                        className="form-group-toggle"
                    >
                        {props.label}
                    </button>
                </div>
                {props.isExpanded && <div className="form-group-content">{props.children}</div>}
            </div>
        </div>
    );
};

export { FormGroup, ValidityState };
