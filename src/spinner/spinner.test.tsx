import * as React from 'react';

import { cleanup, render } from '@config/testing';

import { Spinner } from './';

describe('Violation', () => {
    afterEach(cleanup);

    it('should exist and have three children', () => {
        const { getByDataQa } = render(<Spinner />);
        const spinner = getByDataQa('spinner');
        expect(spinner.children.length).toEqual(3);
    });
});
