import * as React from 'react';

import { cleanup, fireEvent, render } from '@config/testing';

import { Dialog, DialogLevel } from './dialog';

describe('Dialog', () => {
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

        const dialog = getByDataQa(`dialog`);

        expect(dialog).toBeTruthy();
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

        const dialog = getByDataQa(`dialog`);
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

        const dialog = getByDataQa(`dialog`);
        fireEvent.keyUp(dialog, { keyCode: 27 });

        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should close the dialog on click outside', () => {
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
        const dialog = getByDataQa(`dialog`);
        fireEvent.mouseDown(dialog.parentElement as HTMLElement);
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should not close the dialog on click inside', () => {
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
        const dialog = getByDataQa(`dialog`);
        fireEvent.mouseDown(dialog.firstChild as HTMLElement);
        expect(onCancel).not.toHaveBeenCalledTimes(1);
    });

    it('should render the dialog level', () => {
        const id = 'my-dialog';
        const title = 'My dialog';
        const content = 'Message';
        const level = DialogLevel.info;
        const btnConfirmText = 'Confirm';
        const onCancel = jest.fn();
        const onConfirm = jest.fn();

        const { getByDataQa } = render(
            <Dialog
                id={id}
                title={title}
                content={content}
                btnConfirmText={btnConfirmText}
                onCancel={onCancel}
                onConfirm={onConfirm}
                level={level}
            />
        );
        const dialog = getByDataQa('level-info');
        expect(dialog.focus).toBeTruthy();
    });
});
