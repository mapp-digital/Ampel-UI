import * as React from 'react';

import { cleanup, render } from '../../config/testing';

import { Button } from './index';

describe('Button', () => {
    afterEach(cleanup);

    it('should invoke the registered onClick handler', () => {
        const id = 'the-button';
        const text = 'Click ME!';
        const onClick = jest.fn();
        const { getByDataQa } = render(<Button id={id} text={text} type="button" onClick={onClick} />);
        const button = getByDataQa('button-' + id);

        button.click();

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should set button state to disabled', () => {
        const id = 'the-button';
        const text = 'Click ME!';
        const disabled = true;
        const { getByDataQa } = render(<Button id={id} text={text} type="button" disabled={disabled} />);
        const button = getByDataQa('button-' + id) as HTMLButtonElement;

        expect(button.disabled).toBeTruthy();
    });
});
