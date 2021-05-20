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
                <circle
                    id="gray"
                    cx={this.CO_ORDINATE}
                    cy={this.CO_ORDINATE}
                    r={this.props.radius}
                    className={
                        this.props.percentage !== 0
                            ? this.props.limitExceeded
                                ? 'error-text'
                                : 'normal-text'
                            : 'default-text'
                    }
                    style={{ strokeDasharray: `${this.props.percentage !== 0 ? this.props.percentage : '999'} 999` }}
                />
                <circle
                    id="colored-circle"
                    data-qa={'colored-circle'}
                    cx={this.CO_ORDINATE}
                    cy={this.CO_ORDINATE}
                    r={this.props.radius}
                    className={
                        this.props.percentage !== 0
                            ? this.props.limitExceeded
                                ? 'error-text'
                                : 'normal-text'
                            : 'default-text'
                    }
                    style={{ strokeDasharray: `${this.props.percentage !== 0 ? this.props.percentage : '999'} 999` }}
                />
                <text
                    className="character-limit-text"
                    data-qa={'character-limit-text'}
                    x={this.CO_ORDINATE}
                    y={this.CO_ORDINATE}
                    textAnchor="middle"
                    dy=".3em"
                >
                    {this.props.limit}
                </text>
            </svg>
        );
    }
}

export { CharacterLimitChecker };
