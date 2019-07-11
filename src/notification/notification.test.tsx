import * as React from 'react';

import { cleanup, render } from '@config/testing';

import { Notification, NotificationTypes } from './';

describe('Notification', () => {
    afterEach(cleanup);

    it('should render with id', () => {
        const id = 'notification';
        const type = NotificationTypes.SUCCESS;
        const message = 'Message area';
        const onClose = jest.fn();

        const { getByDataQa } = render(<Notification id={id} type={type} message={message} onClose={onClose} />);
        const notification = getByDataQa(`notification-${type}`);

        expect(notification).toBeTruthy();
    });

    it('should invoke onClose handler', () => {
        const id = 'notification';
        const type = NotificationTypes.SUCCESS;
        const message = 'Message area';
        const onClose = jest.fn();

        const { getByDataQa } = render(<Notification id={id} type={type} message={message} onClose={onClose} />);
        const notification = getByDataQa(`notification-${type}`);
        notification.click();

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should render correct notification type', () => {
        const id = 'notification';
        const type = NotificationTypes.SUCCESS;
        const message = 'Message area';
        const onClose = jest.fn();

        const { getByDataQa } = render(<Notification id={id} type={type} message={message} onClose={onClose} />);
        const notification = getByDataQa(`notification-${type}`);

        expect(notification.classList.contains(`notification-${type}`)).toBeTruthy();
    });

    it('should invoke onClose handler after 5 seconds', () => {
        const id = 'notification';
        const type = NotificationTypes.SUCCESS;
        const message = 'Message area';
        const onClose = jest.fn();

        const { wait } = render(<Notification id={id} type={type} message={message} onClose={onClose} />);

        return wait(5000).then(() => {
            expect(onClose).toHaveBeenCalledTimes(1);
        });
    }, 5500);

    it('should NOT invoke onClose handler after 5 seconds if NotificationType is ERROR', () => {
        const id = 'notification';
        const type = NotificationTypes.ERROR;
        const message = 'Message area';
        const onClose = jest.fn();

        const { wait } = render(<Notification id={id} type={type} message={message} onClose={onClose} />);

        return wait(5000).then(() => {
            expect(onClose).not.toHaveBeenCalled();
        });
    }, 5500);
});
