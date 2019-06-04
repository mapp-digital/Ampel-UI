import * as React from 'react';

interface Link {
    url: string;
    target?: string;
}

interface Item {
    id: string;
    label: string;
    link?: Link;
    onClick?: () => void;
    isHeader?: boolean;
}

interface Props<T extends Item> {
    id: string;
    items: Array<T>;
    label: string;
    selectedItemWhen?: (item: T) => boolean;
}

interface State {
    isExpanded: boolean;
}

const HEADER_ITEM_CLASS = 'header';
const HAS_ACTION_ITEM_CLASS = 'has-action';
const SELECTED_CLASS = 'selected';

class Dropdown<T extends Item> extends React.Component<Props<T>, State> {
    private node: any;

    constructor(props: Props<T>) {
        super(props);

        this.state = {
            isExpanded: false,
        };

        this.setNode = this.setNode.bind(this);
        this.renderItems = this.renderItems.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.handleGlobalClick = this.handleGlobalClick.bind(this);
        this.collapseDropdownItems = this.collapseDropdownItems.bind(this);
    }

    public componentWillMount() {
        document.addEventListener('mousedown', this.handleGlobalClick, false);
    }

    public componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleGlobalClick, false);
    }

    public render() {
        return (
            <div ref={this.setNode} className="dropdown" data-qa={`dropdown-${this.props.id}`}>
                <button
                    data-qa={`dropdown--toggle-${this.props.id}`}
                    onClick={this.toggleDropdown}
                    className="dropdown-toggle"
                >
                    <span className="text">{this.props.label}</span>
                    <span className="arrow" />
                </button>
                {this.shouldRenderChildren() && this.renderItems()}
            </div>
        );
    }

    private shouldRenderChildren() {
        return this.state.isExpanded && this.props.items.length > 0;
    }

    private renderItems() {
        return (
            <ul className="dropdown-items" data-qa={`dropdown--items-${this.props.id}`}>
                {this.props.items.map((item) => {
                    return (
                        <li
                            key={item.id}
                            data-qa={`dropdown--item-container-${item.id}`}
                            className={`dropdown-item-container ${this.determineClasses(item)}`}
                        >
                            {item.link ? this.renderLink(item) : this.renderButton(item)}
                        </li>
                    );
                })}
            </ul>
        );
    }

    private renderLink(item: T) {
        return (
            <a
                href={item.link && item.link.url}
                target={item.link && item.link.target}
                data-qa={`dropdown--item-${item.id}`}
                className="dropdown-item"
            >
                {item.label}
            </a>
        );
    }

    private renderButton(item: T) {
        const onClick = () => {
            this.toggleDropdown();
            if (item.onClick) {
                item.onClick();
            }
        };
        return (
            <button
                type="button"
                onClick={onClick}
                data-qa={`dropdown--item-${item.id}`}
                className="dropdown-item"
            >
                {item.label}
            </button>
        );
    }

    private handleGlobalClick(event: MouseEvent) {
        if (!this.node.contains(event.target)) {
            this.collapseDropdownItems();
        }
    }

    private collapseDropdownItems() {
        if (this.state.isExpanded) {
            this.toggleDropdown();
        }
    }

    private setNode(node: any) {
        this.node = node;
    }

    private toggleDropdown() {
        this.setState((prevState) => {
            return { isExpanded: !prevState.isExpanded };
        });
    }

    private determineClasses(item: T) {
        let classes = '';
        if (item.isHeader) {
            classes += ` ${HEADER_ITEM_CLASS}`;
        }

        if (item.onClick) {
            classes += ` ${HAS_ACTION_ITEM_CLASS}`;
        }

        if (this.isSelected(item)) {
            classes += ` ${SELECTED_CLASS}`;
        }

        return classes;
    }

    private isSelected(item: T) {
        return this.props.selectedItemWhen && this.props.selectedItemWhen(item);
    }
}

export { Dropdown, Item, HAS_ACTION_ITEM_CLASS, HEADER_ITEM_CLASS, SELECTED_CLASS };
