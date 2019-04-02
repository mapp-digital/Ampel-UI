/// <reference types="react" />
import { ConstraintViolation, Option, ViolationSeverity } from '../api';
declare enum SectionType {
    TABLE = "TABLE",
    ONE_COLUMN = "ONE_COLUMN",
    TWO_COLUMNS = "TWO_COLUMNS",
    SPLIT_SELECTOR = "SPLIT_SELECTOR"
}
interface Identifiable {
    id: string;
}
declare enum FieldType {
    DATE = "DATE",
    LONG = "LONG",
    NUMBER = "NUMBER",
    STRING = "STRING",
    BOOLEAN = "BOOLEAN",
    INTEGER = "INTEGER"
}
declare type BlurHandler = (event: React.FormEvent) => void;
declare type ValueSetter = (value: any) => void;
interface SectionContext {
    section: Section;
    getValue: (fieldId: string) => any;
    getValueSetter: (fieldId: string) => (value: any) => void;
    getBlurHandler: (fieldId: string) => BlurHandler;
    getFieldViolations: (fieldId: string) => Array<ConstraintViolation>;
}
interface Constraints<FIELD, FORM> {
    min?: number;
    max?: number;
    email?: boolean;
    pattern?: RegExp;
    custom?: Array<(value: FIELD, model: FORM) => Promise<ConstraintViolation | null>>;
    required?: boolean;
}
interface FieldOptions {
    field: string;
}
declare enum Editor {
    OPTIONS_SLIDER = "OPTIONS_SLIDER"
}
interface ConstraintLevels<T, FORM> {
    [ViolationSeverity.ERROR]?: Constraints<T, FORM>;
    [ViolationSeverity.WARNING]?: Constraints<T, FORM>;
    [ViolationSeverity.INFO]?: Constraints<T, FORM>;
}
interface Field<T, FORM> extends Identifiable {
    type: FieldType;
    label: string;
    editor?: Editor;
    render?: (fieldContext: FieldContext<T>, field: Field<T, FORM>) => React.ReactNode;
    append?: string;
    prepend?: string;
    options?: FieldOptions | Array<Option<T>>;
    constraints?: ConstraintLevels<T, FORM>;
    placeholder?: string;
    hidden?: boolean;
}
interface FieldContext<T> {
    value: T;
    setValue: (value: T) => void;
    handleBlur: (event: React.FormEvent<any>) => void;
    violations: Array<ConstraintViolation>;
    sectionContext: SectionContext;
    fieldTypeDefinition: FieldTypeDefinition<any, T>;
}
interface FieldTypeDefinition<INPUT, OUTPUT> {
    parse: (value: INPUT) => OUTPUT;
    format: (value: OUTPUT) => INPUT;
    editorFactory: (fieldContext: FieldContext<any>, field: Field<any, any>) => React.ReactNode;
}
interface Section {
    id: string;
    type: SectionType;
    fields: Array<Field<any, any>>;
}
interface Group {
    id: string;
    label: string;
    sections: Array<Section>;
}
export { BlurHandler, ConstraintLevels, Editor, Group, Section, FieldType, FieldContext, FieldTypeDefinition, Field, Identifiable, ConstraintViolation, SectionType, SectionContext, ValueSetter, };
