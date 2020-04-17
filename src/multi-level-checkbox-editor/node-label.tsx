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
            props.labelInformation.labels.map((label, index) => {
                if (index > 1) {
                    return '';
                }
                return (
                    <div key={index}>
                        <div className={`node-label-${index}`}>{`${label.text + getInfo(label.info)}`}</div>
                    </div>
                );
            })}

        {props.label && props.label}
    </div>
);

const getInfo = (info: string) => {
    if (!info) {
        return '';
    }
    return info ? '' : `— ${info}`;
};
export { NodeLabel, LabelInformation };
