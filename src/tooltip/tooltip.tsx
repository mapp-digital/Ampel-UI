import * as React from 'react';

import RcTooltip from 'rc-tooltip';

interface Props {
    text?: string;
    placement?: string;
}

const Tooltip: React.FunctionComponent<Props> = (props) => {
    return !props.text ? (
        <>{props.children}</>
    ) : (
        <RcTooltip
            overlay={props.text}
            trigger={['hover']}
            placement={props.placement || 'top'}
            mouseLeaveDelay={0}
            destroyTooltipOnHide={true}
        >
            {props.children}
        </RcTooltip>
    );
};

export { Tooltip };
