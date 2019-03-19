import * as React from 'react';

import { cleanup, render } from '../../config/testing';

import { Label } from './index';

describe('Tooltip', () => {
    afterEach(cleanup);

    it('should show a text', () => {
        const value = 'Some Tooltip';
        const append = ' with *';

        const { getByDataQa } = render(<Label for="some-input" value={value} append={append} />);

        const input = getByDataQa('label--for-some-input');
        expect(input.textContent).toEqual(value + append);
    });
});
