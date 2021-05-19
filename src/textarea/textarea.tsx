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
    characterLimit?: number;
}

interface State {
    rows: number;
    value: string;
    limit: number;
    limitExceeded: boolean;
    percentage: number;
}
class Textarea extends React.Component<Props, State> {
    private readonly DEFAULT_ROW_COUNT = 2;
    private readonly RADIUS = 11;

    constructor(props: Props) {
        super(props);
        this.state = {
            rows: this.props.rows ? this.props.rows : this.DEFAULT_ROW_COUNT,
            value: '',
            limit: this.getCharacterLimit() - this.props.value.length,
            limitExceeded: false,
            percentage: 0,
        };
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <div className="textarea-component">
                <textarea
                    id={this.props.id}
                    className={`form-control text-design ${this.props.characterLimit ? 'character-limited' : ''} ${this
                        .props.className || ''}`}
                    rows={this.state.rows}
                    onBlur={this.props.onBlur}
                    onChange={this.onChange}
                    placeholder={this.props.placeholder}
                    data-qa={`textarea--element-${this.props.id}`}
                    value={this.props.value}
                    disabled={this.props.disabled}
                />
                {this.props.characterLimit && (
                    <CharacterLimitChecker
                        radius={this.RADIUS}
                        limitExceeded={this.state.limitExceeded}
                        percentage={this.state.percentage}
                        limit={this.state.limit}
                    />
                )}
            </div>
        );
    }

    private onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.props.onChange(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = event.currentTarget.scrollHeight + 20 + 'px';
        this.setState({
            value: event.target.value,
            limit: this.getRemainingCharacter(event),
            limitExceeded: this.isLimitExceeded(event),
            percentage: this.getPercentage(event),
        });
    }

    private getPercentage(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const circleLength = 2 * Math.PI * this.RADIUS;
        let percentageText = (circleLength * this.getRemainingCharacter(event)) / this.getCharacterLimit();
        if (this.isLimitExceeded(event)) {
            percentageText = circleLength;
        }
        return percentageText;
    }

    private isLimitExceeded(event: React.ChangeEvent<HTMLTextAreaElement>) {
        return this.getRemainingCharacter(event) <= 0;
    }

    private getRemainingCharacter(event: React.ChangeEvent<HTMLTextAreaElement>) {
        return this.getCharacterLimit() - event.target.value.length;
    }
    private getCharacterLimit() {
        return this.props.characterLimit ? this.props.characterLimit : 0;
    }
}

export { Textarea };
