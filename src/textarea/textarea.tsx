import * as React from 'react';

interface Props {
    id: string;
    value: any;
    rows?: number;
    onBlur?: (event: React.FormEvent<HTMLTextAreaElement>) => void;
    onChange: (value: any) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    isCharacterLimitEnabled?: boolean;
}
interface State {
    expanded: boolean;
    rows: number;
    minRows: number;
    maxRows: number;
    value: string;
    limit: number;
    characterLimit: number;
    stroke: string;
    strokeDasharray: string;
    outputText: string;
    radius: number;
}

class TextareaNew extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            expanded: false,
            rows: 3,
            minRows: 3,
            maxRows: 10,
            value: '',
            limit: 255,
            characterLimit: 255,
            stroke: '',
            strokeDasharray: '',
            outputText: '',
            radius: 11,
        };
        this.onChange = this.onChange.bind(this);
    }
    public render() {
        return (
            <div className="textarea-component">
                <textarea
                    id={this.props.id}
                    className={`form-control text-design ${this.state.stroke} ${
                        this.props.isCharacterLimitEnabled ? 'character-limited' : ''
                    } ${this.props.className || ''}`}
                    rows={this.state.rows}
                    onBlur={this.props.onBlur}
                    onChange={this.onChange}
                    placeholder={this.props.placeholder}
                    data-qa={`textarea--element-${this.props.id}`}
                    value={this.props.value}
                    disabled={this.props.disabled}
                />
                {this.props.isCharacterLimitEnabled && (
                    <svg>
                        <circle id="gray" cx="50%" cy="50%" r={this.state.radius} />
                        <circle
                            id="colored"
                            cx="50%"
                            cy="50%"
                            r={this.state.radius}
                            className={this.state.stroke}
                            style={{ strokeDasharray: this.state.strokeDasharray }}
                        />
                        <text
                            className={`character-limit-box ${this.state.stroke}`}
                            x="50%"
                            y="50%"
                            text-anchor="middle"
                            stroke-width="1px"
                            dy=".3em"
                        >
                            {this.state.limit}
                        </text>
                    </svg>
                )}
            </div>
        );
    }
    private onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.props.onChange(event.target.value);
        const { minRows, maxRows } = this.state;

        const currentRows = this.getCurrentRows(event, minRows, maxRows);
        this.setState({
            value: event.target.value,
            rows: currentRows < maxRows ? currentRows : maxRows,
            limit: this.state.characterLimit - event.target.value.length,
            stroke: this.state.characterLimit - event.target.value.length <= 0 ? 'error-text' : 'normal-text',
            strokeDasharray: `${this.getPercentage(event)} 999`,
        });
    }

    private getCurrentRows(event: React.ChangeEvent<HTMLTextAreaElement>, minRows: number, maxRows: number) {
        if (!this.props.isCharacterLimitEnabled) {
            return this.state.rows;
        }
        const textareaLineHeight = 14;

        const previousRows = event.target.rows;
        event.target.rows = minRows;

        const currentRows = Math.floor(event.currentTarget.scrollHeight / textareaLineHeight);

        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }

        if (currentRows >= maxRows) {
            event.currentTarget.rows = maxRows;
            event.currentTarget.scrollTop = event.currentTarget.scrollHeight;
        }
        return currentRows;
    }

    private getPercentage(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const circleLength = 2 * Math.PI * this.state.radius;
        let percentageText =
            (circleLength * (this.state.characterLimit - event.target.value.length)) / this.state.characterLimit;
        if (this.state.characterLimit - event.target.value.length <= 0) {
            percentageText = circleLength;
        }
        return percentageText;
    }
}

export { TextareaNew };
