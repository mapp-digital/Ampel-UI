import * as React from 'react';

import { cleanup, fireEvent, render } from '@config/testing';

import { DialogConsumer, DialogContext, DialogModel, DialogProvider } from './';

const DialogModel: DialogModel = {
    id: 'my-dialog',
    title: 'title',
    content: 'content',
    btnConfirmText: 'Confirm',
    btnCancelText: 'Cancel',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
};

const DummyComponent: React.FunctionComponent<DialogContext> = (props) => {
    const onClick = () => props.dialog.open(DialogModel);
    return <button data-qa="trigger-dialog-button" onClick={onClick} />;
};

const renderWithDialogContext = () => {
    return render(
        <DialogProvider>
            <DialogConsumer>{(context) => context && <DummyComponent dialog={context} />}</DialogConsumer>
        </DialogProvider>
    );
};

describe('Dialog Context', () => {
    afterEach(cleanup);

    it('should open dialog', () => {
        const { getByDataQa } = renderWithDialogContext();

        const btn = getByDataQa(`trigger-dialog-button`);
        btn.click();

        const dialog = getByDataQa(`dialog-my-dialog`);

        expect(dialog).toBeTruthy();
    });

    it('should close dialog upoon pressing `ESC`', () => {
        const { getByDataQa, queryByDataQa } = renderWithDialogContext();

        const btn = getByDataQa(`trigger-dialog-button`);
        btn.click();

        const dialog = getByDataQa(`dialog-my-dialog`);
        fireEvent.keyUp(dialog, { keyCode: 27 });

        const maybeDialog = queryByDataQa(`dialog-my-dialog`) as HTMLElement;
        expect(maybeDialog).toBeFalsy();
    });
});
