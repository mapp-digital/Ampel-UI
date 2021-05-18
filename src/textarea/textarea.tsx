import * as React from 'react';
import { CharacterLimitChecker } from './character-limit-checker';
interface Props {
    id: string;
    value: any;
    rows?: number;
    onBlur?: (event: React.FormEvent<HTMLTextAreaElement>) => void;
    onChange: (value: any) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    enableCharacterLimit?: number;
}

interface State {
    rows: number;
    value: string;
    limit: number;
    stroke: string;
    strokeDasharray: string;
}

enum TextareaConfig {
    minRows = 3,
    maxRows = 10,
}

class Textarea extends React.Component<Props, State> {
    private readonly DEFAULT_ROW_COUNT = 3;
    private readonly RADIUS = 11;

    constructor(props: Props) {
        super(props);
        this.state = {
            rows: this.props.rows ? this.props.rows : this.DEFAULT_ROW_COUNT,
            value: '',
            limit: this.getCharacterLimit() - this.props.value.length,
            stroke: '',
            strokeDasharray: '',
        };
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <div className="textarea-component">
                <textarea
                    id={this.props.id}
                    className={`form-control text-design ${this.state.stroke} ${
                        this.props.enableCharacterLimit ? 'character-limited' : ''
                    } ${this.props.className || ''}`}
                    rows={this.state.rows}
                    onBlur={this.props.onBlur}
                    onChange={this.onChange}
                    placeholder={this.props.placeholder}
                    data-qa={`textarea--element-${this.props.id}`}
                    value={this.props.value}
                    disabled={this.props.disabled}
                />
                {this.props.enableCharacterLimit && (
                    <CharacterLimitChecker
                        radius={this.RADIUS}
                        stroke={this.state.stroke}
                        strokeDasharray={this.state.strokeDasharray}
                        limit={this.state.limit}
                    />
                )}
            </div>
        );
    }

    private onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.props.onChange(event.target.value);
        const currentRows = this.getCurrentRows(event, TextareaConfig.minRows, TextareaConfig.maxRows);
        this.setState({
            value: event.target.value,
            rows: Math.min(currentRows, TextareaConfig.maxRows),
            limit: this.getCharacterCount(event),
            stroke: this.isLimitExceeded(event) ? 'error-text' : 'normal-text',
            strokeDasharray: `${this.getPercentage(event)} 999`,
        });
    }

    private getCurrentRows(event: React.ChangeEvent<HTMLTextAreaElement>, minRows: number, maxRows: number) {
        if (!this.props.enableCharacterLimit) {
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
        const circleLength = 2 * Math.PI * this.RADIUS;
        let percentageText = (circleLength * this.getCharacterCount(event)) / this.getCharacterLimit();
        if (this.isLimitExceeded(event)) {
            percentageText = circleLength;
        }
        return percentageText;
    }

    private isLimitExceeded(event: React.ChangeEvent<HTMLTextAreaElement>) {
        return this.getCharacterCount(event) <= 0;
    }

    private getCharacterCount(event: React.ChangeEvent<HTMLTextAreaElement>) {
        return this.getCharacterLimit() - event.target.value.length;
    }
    private getCharacterLimit() {
        return this.props.enableCharacterLimit ? this.props.enableCharacterLimit : 0;
    }
}

export { Textarea };
