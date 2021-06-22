import { render } from '@config/testing';
import * as React from 'react';

import { TextHighLighter } from './text-highlighter';

describe('Dialog', () => {
    it('should render with highlightedText', () => {
        const content = 'Message admin';
        const { getByDataQa } = render(<TextHighLighter content={content} highlightedTexts={['admin']} />);
        const highlightedText = getByDataQa('highlighted-admin');
        expect(highlightedText).toBeTruthy();
        expect(highlightedText.className).toBe('highlight-text');
    });
});
