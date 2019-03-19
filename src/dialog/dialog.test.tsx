import * as React from 'react';

import { cleanup, fireEvent, render } from '@config/testing';

import { Dialog } from './dialog';

describe('Dialouge', () => {
    afterEach(cleanup);

    it('should render dialog with id', () => {
        const id = 'my-dialog';
        const title = 'My dialog';
        const content = 'Message';
        const btnCancelText = 'Cancel';
        const btnConfirmText = 'Confirm';
        const onCancel = jest.fn();
        const onConfirm = jest.fn();
        const { getByDataQa } = render(
            <Dialog
                id={id}
                title={title}
                content={content}
                btnCancelText={btnCancelText}
                btnConfirmText={btnConfirmText}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        );

        const dialog = getByDataQa(`dialog-${id}`);

        expect(dialog).toBeTruthy();
    });

    it('should invoke onCancel handler', () => {
        const id = 'my-dialog';
        const title = 'My dialog';
        const content = 'Message';
        const btnCancelText = 'Cancel';
        const btnConfirmText = 'Confirm';
        const onCancel = jest.fn();
        const onConfirm = jest.fn();
        const { getByText } = render(
            <Dialog
                id={id}
                title={title}
                content={content}
                btnCancelText={btnCancelText}
                btnConfirmText={btnConfirmText}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        );

        const button = getByText('Cancel');
        button.click();

        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should invoke onConfirm handler', () => {
        const id = 'my-dialog';
        const title = 'My dialog';
        const content = 'Message';
        const btnCancelText = 'Cancel';
        const btnConfirmText = 'Confirm';
        const onCancel = jest.fn();
        const onConfirm = jest.fn();
        const { getByText } = render(
            <Dialog
                id={id}
                title={title}
                content={content}
                btnCancelText={btnCancelText}
                btnConfirmText={btnConfirmText}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        );

        const button = getByText('Confirm');
        button.click();

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should focus dialog on open', () => {
        const id = 'my-dialog';
        const title = 'My dialog';
        const content = 'Message';
        const btnCancelText = 'Cancel';
        const btnConfirmText = 'Confirm';
        const onCancel = jest.fn();
        const onConfirm = jest.fn();
        const { getByDataQa } = render(
            <Dialog
                id={id}
                title={title}
                content={content}
                btnCancelText={btnCancelText}
                btnConfirmText={btnConfirmText}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        );

        const dialog = getByDataQa(`dialog-${id}`);
        expect(dialog.focus).toBeTruthy();
    });

    it('should invoke `onCancel` handler upon pressing `ESC` key', () => {
        const id = 'my-dialog';
        const title = 'My dialog';
        const content = 'Message';
        const btnCancelText = 'Cancel';
        const btnConfirmText = 'Confirm';
        const onCancel = jest.fn();
        const onConfirm = jest.fn();
        const { getByDataQa } = render(
            <Dialog
                id={id}
                title={title}
                content={content}
                btnCancelText={btnCancelText}
                btnConfirmText={btnConfirmText}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        );

        const dialog = getByDataQa(`dialog-${id}`);
        fireEvent.keyUp(dialog, { keyCode: 27 });

        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});
