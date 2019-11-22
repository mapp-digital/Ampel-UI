import * as React from 'react';
import { RefObject } from 'react';

import { isEmpty, isEqual } from 'lodash';

import { Option } from '../api';

interface OptionsRefs {
    [key: number]: RefObject<any>;
}

interface RendererProps<T, O> {
    value: T;
    optionsRefs: OptionsRefs;
    options: Array<O>;
    onChange: (value: T) => void;
}

interface Props<T, O extends Option<T>> {
    value: T;
    options: Array<O>;
    onChange: (value: T) => void;
    renderer?: (props: RendererProps<T, O>) => JSX.Element;
}

const refsReducer = <T extends {}>(refs: OptionsRefs, option: Option<T>, index: number) => {
    refs[index] = React.createRef();
    return refs;
};

class SelectList<T, O extends Option<T>> extends React.Component<Props<T, O>, {}> {
    private optionsRefs: OptionsRefs = this.props.options.reduce(refsReducer, {});

    constructor(props: Props<T, O>) {
        super(props);
    }

    public componentDidMount() {
        this.scrollSelectedItemIntoView();
    }

    public render() {
        return (
            <div className="select-options-wrapper">
                {this.props.renderer
                    ? this.props.renderer({
                          optionsRefs: this.optionsRefs,
                          value: this.props.value,
                          options: this.props.options,
                          onChange: (value: T) => this.props.onChange(value),
                      })
                    : this.renderDefaultList()}
            </div>
        );
    }

    private scrollSelectedItemIntoView() {
        if (!isEmpty(this.props.value)) {
            const selectedItemIndex = this.props.options.findIndex((option) => isEqual(this.props.value, option.value));
            const selectedItemNode = this.optionsRefs[selectedItemIndex].current;
            if (selectedItemNode) {
                selectedItemNode.scrollIntoView({
                    block: 'start',
                });
            }
        }
    }

    private renderDefaultList() {
        return (
            <ul className="select-option-items" data-qa={`select-list--default`}>
                {this.props.options.map((option, index) => {
                    const selectedClass = this.isSelected(option) ? ' selected' : '';
                    const onClick = () => {
                        this.props.onChange(option.value);
                    };
                    return (
                        <li
                            key={index}
                            ref={this.optionsRefs[index]}
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

    private isSelected(option: O) {
        return isEqual(this.props.value, option.value);
    }
}

export { SelectList, RendererProps, Props as SelectListProps };
