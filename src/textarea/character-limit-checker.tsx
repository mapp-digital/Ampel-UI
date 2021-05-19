import * as React from 'react';

interface Props {
    radius: number;
    limitExceeded: boolean;
    percentage: number;
    limit: number;
}

class CharacterLimitChecker extends React.Component<Props> {
    private CO_ORDINATE: string = '50%';

    public render() {
        return (
            <svg id="character-limit-circle" data-qa={'character-limit-circle'} className={'character-limit-circle'}>
                <circle id="gray" cx={this.CO_ORDINATE} cy={this.CO_ORDINATE} r={this.props.radius} />
                <circle
                    id="colored-circle"
                    data-qa={'colored-circle'}
                    cx={this.CO_ORDINATE}
                    cy={this.CO_ORDINATE}
                    r={this.props.radius}
                    className={this.props.limitExceeded ? 'error-text' : 'normal-text'}
                    style={{ strokeDasharray: `${this.props.percentage} 999` }}
                />
                <text
                    id="character-limit-text"
                    data-qa={'character-limit-text'}
                    className={this.props.limitExceeded ? 'error-text' : 'normal-text'}
                    x={this.CO_ORDINATE}
                    y={this.CO_ORDINATE}
                    textAnchor="middle"
                    strokeWidth="1px"
                    dy=".3em"
                >
                    {this.props.limit}
                </text>
            </svg>
        );
    }
}

export { CharacterLimitChecker };
