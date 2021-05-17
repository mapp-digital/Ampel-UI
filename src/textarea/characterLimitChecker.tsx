import * as React from 'react';

interface Props {
    radius: number;
    stroke: string;
    strokeDasharray: string;
    limit: number;
}

interface State {}

class CharacterLimitChecker extends React.Component<Props, State> {
    private CO_ORDINATE: string = '50%';

    render() {
        return (
            <svg className={'character-limit-circle'}>
                <circle id="gray" cx={this.CO_ORDINATE} cy={this.CO_ORDINATE} r={this.props.radius} />
                <circle
                    id="colored"
                    cx={this.CO_ORDINATE}
                    cy={this.CO_ORDINATE}
                    r={this.props.radius}
                    className={this.props.stroke}
                    style={{ strokeDasharray: this.props.strokeDasharray }}
                />
                <text
                    className={this.props.stroke}
                    x={this.CO_ORDINATE}
                    y={this.CO_ORDINATE}
                    text-anchor="middle"
                    stroke-width="1px"
                    dy=".3em"
                >
                    {this.props.limit}
                </text>
            </svg>
        );
    }
}

export { CharacterLimitChecker };
