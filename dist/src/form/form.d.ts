import * as React from 'react';
import { ConstraintViolations, ModelWithMeta } from '../api';
import { FieldContext, FieldType, Group, SectionType } from './types';
interface ValidationOptions {
    onBlur?: boolean;
    onSubmit?: boolean;
    onChange?: boolean;
    delayMillis?: number;
}
interface Props<MODEL> {
    model: MODEL;
    onCancel?: () => void;
    children: Array<Group>;
    onSubmit: (values: ModelWithMeta<MODEL>) => Promise<ModelWithMeta<MODEL> | void>;
    submitButtonText: string;
    cancelButtonText: string;
    violations?: ConstraintViolations;
    validationSchema?: any;
    validationOptions?: ValidationOptions;
}
interface State<MODEL> {
    model: MODEL;
    isDirty: boolean;
    isValid: boolean;
    violations?: ConstraintViolations;
    initialModel: MODEL;
    isSubmitting: boolean;
    expandedGroupId: string | null;
}
declare class Form<MODEL extends object> extends React.Component<Props<MODEL>, State<MODEL>> {
    private valueSetters;
    private blurHandlers;
    private schema;
    private validationOptions;
    private debouncedSetViolations;
    constructor(props: any);
    render(): JSX.Element;
    componentWillMount(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props<MODEL>, prevState: State<MODEL>): void;
    private getCancelButton;
    private resolveGroups;
    private getValidityState;
    private containsChanges;
    private onGroupClick;
    private isCurrentlyExpandedGroupId;
    private resolveGroup;
    private resolveSection;
    private getElements;
    private getValueSetter;
    private getValue;
    private getInitialValue;
    private getBlurHandler;
    private getFieldViolations;
    private validate;
    private computeDirtyState;
    private computeValidState;
    private isValid;
    private onSubmit;
    private submitForm;
    private validateForm;
    private parseModel;
    private commitCurrentModel;
    private setSubmitting;
    private createBlurHandlers;
    private createBlurHandler;
    private createChangeHandlers;
    private createValueSetter;
    private setValue;
    private setViolations;
    private createValidationSchema;
    private createFieldMap;
    private setStateAsync;
}
export { Form, SectionType, FieldType, FieldContext };
