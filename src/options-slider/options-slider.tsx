import { mapValues } from 'lodash';
import Slider from 'rc-slider';
import * as React from 'react';

import { Option } from '../api/index';
import { MarksWithOptions } from './marks-with-options';

interface Props<T> {
    id: string;
    value: T;
    options: Array<Option<T>>;
    onChange: (value: T) => void;
}

interface State<T> {
    currentValue: number;
    marksWithOptions: MarksWithOptions<T>;
}

const MIN_OPTIONS_COUNT = 2;
const ensureMinimunOptionsLength = (options: Array<Option<any>>) => {
    if (options.length < MIN_OPTIONS_COUNT) {
        throw new Error(`Expect at least ${MIN_OPTIONS_COUNT} options but got ${options.length}`);
    }
};

class OptionsSlider<T> extends React.Component<Props<T>, State<T>> {
    constructor(props: Props<T>) {
        ensureMinimunOptionsLength(props.options);
        super(props);

        const marksWithOptions = new MarksWithOptions(this.props.options);
        this.state = {
            currentValue: marksWithOptions.getMarkIndex(this.props.value),
            marksWithOptions,
        };

        this.onChange = this.onChange.bind(this);
        this.onAfterChange = this.onAfterChange.bind(this);
    }

    public render() {
        return (
            <div className="options-slider" data-qa={`options-slider-${this.props.id}`}>
                <Slider
                    max={this.state.marksWithOptions.getMaxStepIndex()}
                    step={1}
                    marks={this.createMarksWithLabelComponents()}
                    value={this.state.currentValue}
                    onChange={this.onChange}
                    onAfterChange={this.onAfterChange}
                />
            </div>
        );
    }

    private createMarksWithLabelComponents() {
        return mapValues(this.state.marksWithOptions.getMarks(), (option) => {
            return (
                <span
                    role="button"
                    onClick={this.onLabelClick.bind(this, option)}
                    data-qa={`options-slider--mark-${option.value}`}
                    className="options-slider-label"
                >
                    {option.label}
                </span>
            );
        });
    }

    private onLabelClick(option: Option<T>) {
        this.props.onChange(option.value);
    }

    private onChange(selectedItemIndex: number) {
        this.setState({ currentValue: selectedItemIndex });
    }

    private onAfterChange(selectedItemIndex: number) {
        const option = this.state.marksWithOptions.getOption(selectedItemIndex);
        this.props.onChange(option.value);
    }
}

export { OptionsSlider };
