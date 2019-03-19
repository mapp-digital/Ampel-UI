import * as React from 'react';

import { cleanup, render } from '@config/testing';

import { NotificationsConsumer, NotificationsContext, NotificationsProvider, NotificationTypes } from './';

const DummyComponent: React.FunctionComponent<NotificationsContext> = (props) => {
    const onClick = () => props.notifications.show({ message: 'Not good', type: NotificationTypes.ERROR });
    return <button data-qa="trigger-notification-button" onClick={onClick} />;
};

const renderWithNotificationContext = () => {
    return render(
        <NotificationsProvider>
            <NotificationsConsumer>
                {(context) => context && <DummyComponent notifications={context} />}
            </NotificationsConsumer>
        </NotificationsProvider>
    );
};

describe('NotificationContext', () => {
    afterEach(cleanup);

    it('should show notification', () => {
        const { getByDataQa } = renderWithNotificationContext();

        const wrapper = getByDataQa('notification-wrapper');
        const btn = getByDataQa('trigger-notification-button');

        btn.click();

        expect(wrapper.children.length).toBe(1);
    });

    it('should hide notification on click', () => {
        const { getByDataQa } = renderWithNotificationContext();

        const wrapper = getByDataQa('notification-wrapper');
        const btn = getByDataQa('trigger-notification-button');

        btn.click();

        const notification = wrapper.children[0] as HTMLDivElement;
        notification.click();

        expect(wrapper.children.length).toBe(0);
    });

    it('should show multiple notifications', () => {
        const { getByDataQa } = renderWithNotificationContext();

        const wrapper = getByDataQa('notification-wrapper');
        const btn = getByDataQa('trigger-notification-button');

        btn.click();
        btn.click();

        expect(wrapper.children.length).toBe(2);
    });
});
