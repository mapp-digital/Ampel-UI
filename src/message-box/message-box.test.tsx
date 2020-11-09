import * as React from 'react';

import { MessageBox, MessageBoxSeverity } from './';

import { cleanup, render } from '@config/testing';

describe('MessageBox', () => {
    afterEach(cleanup);

    it('should initially render content', () => {
        const id = 'someId';
        const message = 'someMessage';

        const { getByDataQa } = render(<MessageBox id={id} message={message} severity={MessageBoxSeverity.INFO} />);
        const messageBoxContent = getByDataQa(`message-box--content-${id}`);

        expect(messageBoxContent).toBeTruthy();
    });

    it('should render the icon', () => {
        const id = 'someId';
        const message = 'someMessage';

        const { getByDataQa } = render(<MessageBox id={id} message={message} severity={MessageBoxSeverity.INFO} />);
        const messageBoxIconWrapper = getByDataQa(`message-box--icon-wrapper`);

        expect(messageBoxIconWrapper).toBeTruthy();
    });

    it('should render the headline if given', () => {
        const id = 'someId';
        const headline = 'someHeadline';
        const message = 'someMessage';

        const { getByDataQa } = render(
            <MessageBox id={id} message={message} severity={MessageBoxSeverity.INFO} headline={headline} />
        );
        const messageBoxHeadline = getByDataQa(`message-box--headline`);

        expect(messageBoxHeadline.textContent).toEqual(headline);
    });

    it('should NOT render the headline if none given', () => {
        const id = 'someId';
        const message = 'someMessage';

        const { queryByDataQa } = render(<MessageBox id={id} message={message} severity={MessageBoxSeverity.INFO} />);
        const messageBoxHeadline = queryByDataQa(`message-box--headline`);

        expect(messageBoxHeadline).toBeFalsy();
    });

    it('should render the message', () => {
        const id = 'someId';
        const message = 'someMessage';

        const { getByDataQa } = render(<MessageBox id={id} message={message} severity={MessageBoxSeverity.INFO} />);
        const messageBoxMessage = getByDataQa(`message-box--message`);

        expect(messageBoxMessage.textContent).toEqual(message);
    });

    it('should render with fallback id if none given', () => {
        const message = 'someMessage';

        const { getByDataQa } = render(<MessageBox message={message} severity={MessageBoxSeverity.INFO} />);
        const messageBoxContent = getByDataQa(`message-box--content-default`);

        expect(messageBoxContent).toBeTruthy();
    });

    it('should contain the class matching the severity', () => {
        const message = 'someMessage';
        const severity = MessageBoxSeverity.INFO;

        const { getByDataQa } = render(<MessageBox message={message} severity={severity} />);
        const messageBoxContent = getByDataQa(`message-box-default`);

        expect(messageBoxContent.classList.contains(severity)).toBeTruthy();
    });
});
