import * as React from 'react';

import { Option } from '../api';

import { isEqual } from 'lodash';

// interface Refs {
//     [key: number]: HTMLElement
// }

interface RendererProps<T, O> {
    value: T;
    options: Array<O>;
    onChange: (value: T) => void;
    refs: any;
}

interface Props<T, O extends Option<T>> {
    value: T;
    options: Array<O>;
    onChange: (value: T) => void;
    renderer?: (props: RendererProps<T, O>) => JSX.Element;
}

class SelectList<T, O extends Option<T>> extends React.Component<Props<T, O>, {}> {
    private allRefs: any = this.props.options.reduce((refs, option, index) => {
        refs[index] = React.createRef();
        return refs;
    }, {});

    constructor(props: Props<T, O>) {
        super(props);
    }

    public componentDidMount() {
        this.scrollActiveItemIntoView();
    }

    public render() {
        return (
            <div className="select-options-wrapper">
                {this.props.renderer
                    ? this.props.renderer({
                          value: this.props.value,
                          refs: this.allRefs,
                          options: this.props.options,
                          onChange: (value: T) => this.props.onChange(value),
                      })
                    : this.renderDefaultList()}
            </div>
        );
    }

    private scrollActiveItemIntoView() {
        const selectedItemIndex = this.props.options.findIndex((option) => isEqual(option.value, this.props.value));
        if (selectedItemIndex !== -1) {
            this.allRefs[selectedItemIndex].current.scrollIntoView({
                block: 'start',
            });
        }
    }

    private isSelected(option: O) {
        return isEqual(this.props.value, option.value);
    }

    private renderDefaultList() {
        return (
            <ul className="select-option-items" data-qa={`select--option-items`}>
                {this.props.options.map((option, index) => {
                    const selectedClass = this.isSelected(option) ? ' selected' : '';
                    const onClick = () => {
                        this.props.onChange(option.value);
                    };
                    return (
                        <li
                            key={index}
                            ref={this.allRefs[index]}
                            role="option"
                            onClick={onClick}
                            data-qa={`select--option-${option.label}`}
                            className={`item${selectedClass}`}
                            aria-selected={this.isSelected(option)}
                        >
                            {option.label}
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export { SelectList, Props as RendererProps };
