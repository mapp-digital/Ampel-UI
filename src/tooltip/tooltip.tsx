import * as React from 'react';

import TooltipTrigger from 'react-popper-tooltip';
import { TooltipArg, Trigger } from 'react-popper-tooltip/dist/types';

import PopperJS from 'popper.js';
import { ReactNode } from 'react';

interface Props {
    // @deprecated
    text?: string;
    content?: string | ReactNode;
    placement?: string;
    trigger?: Trigger;
    tooltipShown?: boolean;
}

interface ArrowProps {
    tooltip?: string | ReactNode;
    hideArrow?: boolean;
}

type TooltipTriggerAndArrowProps = ArrowProps & {
    placement: any;
    trigger: Trigger;
    children: any;
    tooltipShown?: boolean;
};

const getTooltip = ({ tooltip, hideArrow }: ArrowProps) => ({
    arrowRef,
    tooltipRef,
    getArrowProps,
    getTooltipProps,
    placement,
}: TooltipArg) => (
    <div
        {...getTooltipProps({
            ref: tooltipRef,
            className: `tooltip-container tooltip-container-${placement}`,
        })}
    >
        {!hideArrow && (
            <div
                {...getArrowProps({
                    ref: arrowRef,
                    className: `tooltip-arrow tooltip-arrow-${placement}`,
                    'data-placement': placement,
                })}
            />
        )}
        {tooltip}
    </div>
);

const TooltipCom = ({ children, tooltip, hideArrow, ...props }: TooltipTriggerAndArrowProps) => (
    <TooltipTrigger {...props} tooltip={getTooltip({ tooltip, hideArrow })}>
        {({ getTriggerProps, triggerRef }) => (
            <span
                {...getTriggerProps({
                    ref: triggerRef,
                    className: 'tooltip-trigger',
                })}
            >
                {children}
            </span>
        )}
    </TooltipTrigger>
);
const Tooltip: React.FunctionComponent<Props> = (props) => {
    return !props.text && !props.content ? (
        <>{props.children}</>
    ) : (
        <TooltipCom
            placement={(props.placement || 'top') as PopperJS.Placement}
            trigger={props.trigger || 'hover'}
            tooltip={props.text ? props.text : props.content}
            tooltipShown={props.tooltipShown}
        >
            {props.children}
        </TooltipCom>
    );
};

export { Tooltip };
