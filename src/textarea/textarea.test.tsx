import * as React from 'react';

import { cleanup, fireEvent, render } from '../../config/testing';

import { Textarea } from './index';

const changeValue = (node: HTMLElement, value: string) => {
    fireEvent.change(node, { target: { value } });
};

const emitBlur = (node: HTMLElement) => {
    fireEvent.blur(node);
};

describe('Textarea', () => {
    afterEach(cleanup);

    it('should show passed value and handle changes', () => {
        const id = 'my-txtarea';
        const value = 'Textarea content';
        const onChange = jest.fn();

        const { getByDataQa } = render(<Textarea id={id} value={value} onChange={onChange} />);

        const textarea = getByDataQa(`textarea--element-${id}`) as HTMLTextAreaElement;
        expect(textarea.value).toEqual(value);

        const newValue = 'New value';
        changeValue(textarea, newValue);

        expect(onChange).toHaveBeenNthCalledWith(1, newValue);
    });

    it('should invoke onBlur handler', () => {
        const id = 'my-txtarea';
        const value = 'Textarea content';
        const onChange = jest.fn();
        const onBlur = jest.fn();

        const { getByDataQa } = render(<Textarea id={id} value={value} onChange={onChange} onBlur={onBlur} />);

        const textarea = getByDataQa(`textarea--element-${id}`) as HTMLTextAreaElement;

        emitBlur(textarea);

        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should render textarea with 3 rows as default', () => {
        const id = 'my-txtarea';
        const value = 'Textarea content';
        const onChange = jest.fn();

        const { getByDataQa } = render(<Textarea id={id} value={value} onChange={onChange} />);

        const textarea = getByDataQa(`textarea--element-${id}`) as HTMLTextAreaElement;

        expect(textarea.rows).toEqual(3);
    });

    it('should render textarea with passed number of rows', () => {
        const id = 'my-txtarea';
        const value = 'Textarea content';
        const onChange = jest.fn();
        const rows = 9;

        const { getByDataQa } = render(<Textarea id={id} value={value} onChange={onChange} rows={rows} />);

        const textarea = getByDataQa(`textarea--element-${id}`) as HTMLTextAreaElement;

        expect(textarea.rows).toEqual(rows);
    });

    it('should render placeholder', () => {
        const id = 'my-txtarea';
        const value = 'Textarea content';
        const onChange = jest.fn();
        const placeholder = 'Cool placeholder';

        const { getByDataQa } = render(
            <Textarea id={id} value={value} onChange={onChange} placeholder={placeholder} />
        );
        const textarea = getByDataQa(`textarea--element-${id}`) as HTMLTextAreaElement;

        expect(textarea.placeholder).toEqual(placeholder);
    });

    it('should be disabled', () => {
        const id = 'my-txtarea';
        const value = 'Textarea content';
        const onChange = jest.fn();
        const disabled = true;

        const { getByDataQa } = render(<Textarea id={id} value={value} onChange={onChange} disabled={disabled} />);
        const textarea = getByDataQa(`textarea--element-${id}`) as HTMLTextAreaElement;

        expect(textarea.disabled).toBeTruthy();
    });

    it('should be disabled', () => {
        const id = 'my-txtarea';
        const value = 'Textarea content';
        const onChange = jest.fn();

        const { getByDataQa } = render(
            <Textarea id={id} enableCharacterLimit={true} value={value} onChange={onChange} />
        );
        const characterLimitArea = getByDataQa(`character-limit-circle`) as HTMLTextAreaElement;

        expect(characterLimitArea).toBeTruthy();
    });
});
