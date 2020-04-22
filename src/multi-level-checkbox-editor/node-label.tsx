import * as React from 'react';
import { Node } from './multi-level-checkbox-editor';

interface LabelDetails {
    text: string;
    info: string;
}

interface LabelInformation {
    labels: Array<LabelDetails>;
    note: string;
}

interface Props {
    node: Node;
}

const NodeLabel: React.FunctionComponent<Props> = (props) => (
    <div className={'node-label'}>
        {props.node.labelInformation &&
            props.node.labelInformation.labels.length > 0 &&
            props.node.labelInformation.labels.slice(0, 2).map((label, index) => {
                return (
                    <div key={index}>
                        <div className={`node-label-${index}`}>
                            {label.text}
                            <span className={'higlighted-text'}>{label.info ? `- ${label.info}` : ''}</span>
                        </div>
                    </div>
                );
            })}

        {props.node.label}
    </div>
);
export { NodeLabel, LabelInformation };
