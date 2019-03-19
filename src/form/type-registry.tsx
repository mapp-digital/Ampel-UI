import * as React from 'react';

import { Checkbox } from '../checkbox';
import { Input } from '../input';
import { OptionsSlider } from '../options-slider';
import { Select } from '../select';
import { FormField } from './form-field';
import { Editor, Field, FieldContext, FieldType, FieldTypeDefinition, SectionContext, SectionType } from './types';

interface FieldComponent<FIELD, MODEL> {
    fieldContext: FieldContext<FIELD>;
    field: Field<FIELD, MODEL>;
}

const BooleanField: React.FunctionComponent<FieldComponent<boolean, any>> = (props) => {
    const field = props.field;
    const fieldContext = props.fieldContext;
    return (
        <FormField id={field.id} key={field.id} label={field.label} violations={fieldContext.violations}>
            <Checkbox id={field.id} value={fieldContext.value} onChange={fieldContext.setValue} />
        </FormField>
    );
};

const DefaultField: React.FunctionComponent<FieldComponent<boolean, any>> = (props) => {
    const field = props.field;
    const fieldContext = props.fieldContext;
    const isRequired = field.constraints && field.constraints.ERROR && field.constraints.ERROR.required;
    const optionsOrOptionsField = field.options;
    const options =
        optionsOrOptionsField &&
        (Array.isArray(optionsOrOptionsField)
            ? optionsOrOptionsField
            : fieldContext.sectionContext.getValue(optionsOrOptionsField.field));

    const getEditor = () => {
        if (field.editor === Editor.OPTIONS_SLIDER) {
            return (
                <OptionsSlider
                    id={field.id}
                    value={fieldContext.value}
                    options={options}
                    onChange={fieldContext.setValue}
                />
            );
        }
        return options ? (
            <Select
                id={field.id}
                value={fieldContext.value}
                options={options}
                onChange={fieldContext.setValue}
                placeholder={field.placeholder}
            />
        ) : (
            <Input
                id={field.id}
                value={fieldContext.value}
                onBlur={fieldContext.handleBlur}
                append={field.append}
                prepend={field.prepend}
                onChange={fieldContext.setValue}
                placeholder={field.placeholder}
            />
        );
    };

    return (
        <FormField
            id={field.id}
            key={field.id}
            label={field.label}
            required={isRequired}
            violations={fieldContext.violations}
            hidden={field.hidden}
        >
            {getEditor()}
        </FormField>
    );
};

const createSingleColumnFields = (sectionContext: SectionContext): React.ReactNode => {
    return sectionContext.section.fields.map((field) => {
        const fieldContext: FieldContext<any> = {
            value: sectionContext.getValue(field.id),
            setValue: sectionContext.getValueSetter(field.id),
            violations: sectionContext.getFieldViolations(field.id),
            handleBlur: sectionContext.getBlurHandler(field.id),
            sectionContext,
            fieldTypeDefinition: getFieldTypeDefinition(field.type),
        };

        if (field.hidden) {
            return null;
        }

        if (field.render) {
            return field.render(fieldContext, field);
        }

        const fieldFactory = fieldContext.fieldTypeDefinition.editorFactory;
        return fieldFactory && fieldFactory(fieldContext, field);
    });
};

const stringFieldTypeDefinition: FieldTypeDefinition<string, string> = {
    parse: (value: string) => value,
    format: (value: string) => value,
    editorFactory: (fieldContext, field) => <DefaultField key={field.id} fieldContext={fieldContext} field={field} />,
};

const numberFieldTypeDefinition: FieldTypeDefinition<string, number> = {
    parse: (value: string) => Number.parseFloat(value),
    format: (value: number) => '' + value,
    editorFactory: (fieldContext, field) => <DefaultField key={field.id} fieldContext={fieldContext} field={field} />,
};

const booleanFieldTypeDefinition: FieldTypeDefinition<boolean, boolean> = {
    parse: (value: boolean) => value,
    format: (value: boolean) => value,
    editorFactory: (fieldContext, field) => <BooleanField key={field.id} fieldContext={fieldContext} field={field} />,
};

const integerFieldTypeDefinition: FieldTypeDefinition<string, number> = {
    parse: (value: string) => Number.parseInt(value, 10),
    format: (value: number) => '' + value,
    editorFactory: (fieldContext, field) => <DefaultField key={field.id} fieldContext={fieldContext} field={field} />,
};

const fieldTypeDefinitions = new Map<FieldType, FieldTypeDefinition<any, any>>();
fieldTypeDefinitions.set(FieldType.STRING, stringFieldTypeDefinition);
fieldTypeDefinitions.set(FieldType.NUMBER, numberFieldTypeDefinition);
fieldTypeDefinitions.set(FieldType.BOOLEAN, booleanFieldTypeDefinition);
fieldTypeDefinitions.set(FieldType.INTEGER, integerFieldTypeDefinition);

const sectionFactories = new Map<SectionType, (sectionContext: SectionContext) => React.ReactNode>();
sectionFactories.set(SectionType.ONE_COLUMN, createSingleColumnFields);

const getFieldTypeDefinition = (fieldType: FieldType) => {
    const typeDefinition = fieldTypeDefinitions.get(fieldType);
    if (!typeDefinition) {
        throw new Error(`The requested FieldType < ${fieldType} > is not known.`);
    }
    return typeDefinition;
};

const getSectionFactory = (sectionType: SectionType) => sectionFactories.get(sectionType);

export { getFieldTypeDefinition, getSectionFactory };
