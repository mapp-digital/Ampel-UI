import * as React from 'react';

import { cleanup, fireEvent, render } from '@config/testing';

import { Dialog } from './dialog';

const id = 'my-dialog';
const title = 'My dialog';
const content = 'Message';
const btnCancelText = 'Cancel';
const btnConfirmText = 'Confirm';
let onCancel = jest.fn();
let onConfirm = jest.fn();

describe('Dialouge', () => {
    afterEach(() => {
        cleanup();
        onCancel = jest.fn();
        onConfirm = jest.fn();
    });

    it('should render dialog with id', () => {
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

    it('should close the Modal when click outside the dialog', () => {
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
        fireEvent.mouseDown(dialog.parentElement as HTMLElement);
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should not close the Modal when click inside the dialog', () => {
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
        fireEvent.mouseDown(dialog.firstChild as HTMLElement);
        expect(onCancel).not.toHaveBeenCalledTimes(1);
    });
});
