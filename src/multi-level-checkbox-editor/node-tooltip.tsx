import { Tooltip } from '@ampel-ui/tooltip';
import * as React from 'react';
import { Node } from './multi-level-checkbox-editor';

interface Props {
    node: Node;
}

const NodeToolTip: React.FunctionComponent<Props> = (props) => (
    <div className={'node-tooltip-note'}>
        {props.node.labelInformation &&
            props.node.labelInformation.labels &&
            props.node.labelInformation.labels.length > 1 && (
                <>
                    <div className={'note-info'}>
                        <div className={'label-information-note'}>
                            <div>{props.node.labelInformation.note}</div>
                        </div>
                    </div>

                    <div className={'node-tooltip'}>
                        <Tooltip
                            placement="left"
                            content={
                                <div className={'node-tooltip-container-box'}>
                                    {props.node.labelInformation.labels
                                        .map((label, index) => {
                                            return `${label.text}${label.info ? ` – ${label.info}` : ''}`;
                                        })
                                        .join(', ')}
                                </div>
                            }
                        >
                            <i className={'icon-info-tooltip'} />
                        </Tooltip>
                    </div>
                </>
            )}
    </div>
);

export { NodeToolTip };
