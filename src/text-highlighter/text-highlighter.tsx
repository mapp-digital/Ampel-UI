import * as React from 'react';

interface Props {
    highlightedTexts: Array<string>;
    content: string;
}

class TextHighLighter extends React.Component<Props, {}> {
    public render() {
        const parts = this.props.content.split(new RegExp(`(${this.props.highlightedTexts.join('|')})`, 'g'));
        /* tslint:disable */
        console.log(parts);
        return (
            <div>
                {parts.map((part, i) => (
                    <span
                        data-qa={`highlighted-${part}`}
                        key={i}
                        className={this.checkMatch(part) ? 'highlight-text' : ''}
                    >
                        {part}
                    </span>
                ))}
            </div>
        );
    }
    private checkMatch(input: string) {
        return this.getEscapedTexts().filter((text) => input.match(new RegExp(`(${text})`, 'g'))).length > 0;
    }
    private getEscapedTexts() {
        return this.props.highlightedTexts.map((highlight) => highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    }
}
export { TextHighLighter };
