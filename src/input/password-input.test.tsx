import * as React from 'react';

import { cleanup, render } from '@config/testing';

import { PasswordInput } from './password-input';

describe('PasswordInput', () => {
    afterEach(cleanup);

    it('should exist', () => {
        const id = 'password-input';
        const value = '';
        const onChange = jest.fn();

        const { getByDataQa } = render(<PasswordInput id={id} value={value} onChange={onChange} />);
        const passwordInput = getByDataQa(`password-input--component-${id}`);
        expect(passwordInput).toBeTruthy();
    });

    it('should render input type as password', () => {
        const id = 'password-input';
        const value = '';
        const onChange = jest.fn();

        const { getByDataQa } = render(<PasswordInput id={id} value={value} onChange={onChange} />);
        const passwordInput = getByDataQa(`password-input--component-${id}`) as HTMLInputElement;
        expect(passwordInput.type).toEqual('password');
        expect(passwordInput.autocomplete).toEqual('on');
    });

    it('should disable auto-complete feature', () => {
        const id = 'password-input';
        const value = '';
        const onChange = jest.fn();

        const { getByDataQa } = render(
            <PasswordInput id={id} value={value} onChange={onChange} disableAutoComplete={true} />
        );
        const passwordInput = getByDataQa(`password-input--component-${id}`) as HTMLInputElement;
        expect(passwordInput.autocomplete).toEqual('new-password');
    });
});
