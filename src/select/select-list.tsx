import * as React from 'react';
import { RefObject } from 'react';

import { isEmpty, isEqual } from 'lodash';

import { Option } from '../api';

interface OptionsRefs {
    [key: number]: RefObject<any>;
}

interface RendererProps<T, O> {
    value?: T;
    options: Array<O>;
    optionsRefs: OptionsRefs;
    onChange: (value: T) => void;
    disableOptionWhen?: (value: T) => boolean;
}

interface Props<T, O extends Option<T>> {
    value?: T;
    options: Array<O>;
    onChange: (value: T) => void;
    disableOptionWhen?: (value: T) => boolean;
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
        if (this.props.renderer) {
            return (
                <>
                    {this.props.renderer({
                        value: this.props.value,
                        options: this.props.options,
                        optionsRefs: this.optionsRefs,
                        disableOptionWhen: this.props.disableOptionWhen,
                        onChange: this.props.onChange,
                    })}
                </>
            );
        }
        return this.renderDefaultList();
    }

    private scrollSelectedItemIntoView() {
        if (!isEmpty(this.props.value)) {
            const selectedItemIndex = this.props.options.findIndex((option) => isEqual(this.props.value, option.value));
            const selectedItemNode = this.optionsRefs[selectedItemIndex] && this.optionsRefs[selectedItemIndex].current;
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
                    const disabledClass = this.isOptionDisabled(option.value) ? ' disabled' : '';
                    const onClick = () => {
                        if (!this.isOptionDisabled(option.value)) {
                            this.props.onChange(option.value);
                        }
                    };
                    return (
                        <li
                            key={index}
                            ref={this.optionsRefs[index]}
                            role="option"
                            onClick={onClick}
                            data-qa={`select--option-${option.label}`}
                            className={`item${selectedClass}${disabledClass}`}
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

    private isOptionDisabled(value: T) {
        return this.props.disableOptionWhen && this.props.disableOptionWhen(value);
    }
}

export { SelectList, RendererProps, Props as SelectListProps };
