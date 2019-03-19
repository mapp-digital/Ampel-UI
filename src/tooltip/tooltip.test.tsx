import * as React from 'react';

import { cleanup, render } from '@config/testing';

import { Tooltip } from './';

describe('Tooltip', () => {
    afterEach(cleanup);

    it('should be rendered', () => {
        const id = 'someId';
        const text = 'Some Text';
        const { getByDataQa } = render(
            <Tooltip text={text}>
                <div data-qa={id} />
            </Tooltip>
        );

        const element = getByDataQa(id);

        expect(element).toBeTruthy();
    });
});
