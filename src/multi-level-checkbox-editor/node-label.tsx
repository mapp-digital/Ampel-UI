import * as React from 'react';

interface LabelDetails {
    text: string;
    info: string;
}

interface LabelInformation {
    labels: Array<LabelDetails>;
    note: string;
}

interface Props {
    labelInformation?: LabelInformation;
    label?: string;
}

const NodeLabel: React.FunctionComponent<Props> = (props) => (
    <div className={'node-label'}>
        {props.labelInformation &&
            props.labelInformation.labels.length > 0 &&
            props.labelInformation.labels.slice(0, 2).map((label, index) => {
                return (
                    <div key={index}>
                        <div className={`node-label-${index}`}>
                            {label.text}
                            <span className={'higlighted-text'}>{label.info ? `- ${label.info}` : ''}</span>
                        </div>
                    </div>
                );
            })}

        {props.label}
    </div>
);
export { NodeLabel, LabelInformation };
