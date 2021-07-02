import { debounce, flatMapDeep, get, has, isEqual, isFunction, set, template, throttle } from 'lodash';
import * as React from 'react';

import { ConstraintViolations, ModelWithMeta, modelWithViolations, ViolationSeverity } from '../api';
import { Button } from '../button';
import { FormGroup } from './form-group';
import { ConstraintValidator, createFieldValidators, getGroupValidityState, validateField } from './form-validation';
import { getFieldTypeDefinition, getSectionFactory } from './type-registry';
import {
    BlurHandler,
    ConstraintViolation,
    Field,
    FieldContext,
    FieldType,
    Group,
    Section,
    SectionContext,
    SectionType,
    ValueSetter,
} from './types';

const isSectionTypeSupported = (section: Section) => {
    return [SectionType.ONE_COLUMN, SectionType.TWO_COLUMNS].indexOf(section.type) > -1;
};

const ensureProperty = (suspect: any, key: string): void => {
    if (!has(suspect, key)) {
        throw new Error(`No model for property < ${key} > given.`);
    }
};

const getDeclaredFields = (groups: Array<Group>) => {
    return flatMapDeep<Field<any, any>>(
        groups.map((group: Group) => {
            return group.sections.filter(isSectionTypeSupported).map((section: Section) => section.fields);
        })
    );
};

const nop = () => {
    /* nop */
};

const defaultViolationMessageMap = {
    'form.violation.number': 'is not number',
    'form.violation.integer': 'is not number',
    'form.violation.required': 'is required',
    'form.violation.min': 'should be greater than or equal ${minValue}',
    'form.violation.max': 'should be smaller than or equal ${maxValue}',
    'form.violation.email': 'is not valid email',
    'form.violation.pattern': 'contains illegal characters',
};

const defaultViolationMessageResolver: ViolationMessageResolver = (key, context) => {
    const message = defaultViolationMessageMap[key];
    if (typeof message === 'undefined') {
        return key;
    }
    return template(message)(context || {});
};

const getValidationOptionsDefaults = (): ValidationOptions => {
    return {
        onBlur: true,
        onSubmit: true,
        onChange: true,
        delayMillis: 200,
    };
};

interface ValidationOptions {
    onBlur?: boolean;
    onSubmit?: boolean;
    onChange?: boolean;
    delayMillis?: number;
}

type ViolationMessageResolver = (key: string, context: object | null) => string;

interface FormButtonProps {
    key: number;
    isSubmitting: boolean;
    isDirty: boolean;
    isValid: boolean;
    resetForm: () => void;
}

interface Props<MODEL> {
    model: MODEL;
    onCancel?: () => void;
    onUpdate?: (model: MODEL) => void;
    children: Array<Group>;
    onSubmit: (values: ModelWithMeta<MODEL>) => Promise<ModelWithMeta<MODEL> | void>;
    submitButtonText: string;
    cancelButtonText: string;
    violations?: ConstraintViolations;
    validationSchema?: any;
    expandedGroupIds?: Array<string>;
    validationOptions?: ValidationOptions;
    resolveViolationMessage?: ViolationMessageResolver;
    additionalButtonRenderers?: Array<(buttonProps: FormButtonProps) => React.ReactNode>;
    isDirty?: boolean;
}

interface State<MODEL> {
    model: MODEL;
    isDirty: boolean;
    isValid: boolean;
    violations?: ConstraintViolations;
    initialModel: MODEL;
    isSubmitting: boolean;
    expandedGroupsIds: Array<string>;
}

class Form<MODEL extends object> extends React.Component<Props<MODEL>, State<MODEL>> {
    private valueSetters: { [key: string]: ValueSetter };
    private blurHandlers: { [key: string]: BlurHandler };
    private schema: { [key: string]: Array<ConstraintValidator<any, MODEL>> };
    private validationOptions: ValidationOptions;
    private debouncedSetViolations: any;

    constructor(props: any) {
        super(props);

        this.state = {
            model: this.props.model,
            isDirty: this.props.isDirty || false,
            isValid: true,
            violations: this.props.violations || {},
            initialModel: this.props.model,
            isSubmitting: false,
            expandedGroupsIds: this.getInitiallyExpandedGroupIds(),
        };

        this.validationOptions = Object.assign(this.props.validationOptions || {}, getValidationOptionsDefaults());

        this.onSubmit = this.onSubmit.bind(this);
        this.onUpdate = throttle(this.onUpdate.bind(this), 500);
        this.getValue = this.getValue.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.onGroupClick = this.onGroupClick.bind(this);
        this.setViolations = this.setViolations.bind(this);
        this.getValueSetter = this.getValueSetter.bind(this);
        this.getBlurHandler = this.getBlurHandler.bind(this);
        this.computeValidState = this.computeValidState.bind(this);
        this.getFieldViolations = this.getFieldViolations.bind(this);
        this.setViolationsFromProps = this.setViolationsFromProps.bind(this);
        this.getExpandedGroupIds = this.getExpandedGroupIds.bind(this);

        this.debouncedSetViolations = debounce(this.setViolations, this.validationOptions.delayMillis);
    }

    public render() {
        return (
            <form onSubmit={this.onSubmit} className="form">
                {this.resolveGroups(this.props.children)}
                <div className="row center">
                    <div className="col-xs-12">
                        {this.props.onCancel && this.getCancelButton()}

                        {this.props.additionalButtonRenderers &&
                            this.props.additionalButtonRenderers.map((buttonRenderer, index) =>
                                buttonRenderer({
                                    key: index,
                                    isSubmitting: this.state.isSubmitting,
                                    isDirty: this.state.isDirty,
                                    isValid: this.state.isValid,
                                    resetForm: this.resetForm,
                                })
                            )}

                        <Button
                            id="submit"
                            text={this.props.submitButtonText}
                            type="submit"
                            className="btn btn-primary"
                            disabled={this.state.isSubmitting || !this.state.isDirty || !this.state.isValid}
                        />
                    </div>
                </div>
            </form>
        );
    }

    public componentWillMount() {
        this.createChangeHandlers();
        this.createBlurHandlers();
    }

    public componentDidMount() {
        this.createValidationSchema(this.props.children);
        this.computeValidState();
    }

    public componentDidUpdate(prevProps: Props<MODEL>, prevState: State<MODEL>) {
        if (!isEqual(this.state.model, prevState.model)) {
            this.computeDirtyState();
            this.onUpdate();
        }
        if (!isEqual(this.state.violations, prevState.violations)) {
            this.computeValidState();
        }
        if (!isEqual(this.props.violations, prevProps.violations)) {
            this.setViolationsFromProps();
            this.computeValidState();
        }
        if (!isEqual(this.state.initialModel, prevState.initialModel)) {
            this.computeDirtyState();
        }
    }

    private getInitiallyExpandedGroupIds() {
        return this.props.expandedGroupIds || [this.props.children[0].id];
    }

    private resetForm() {
        this.setState({
            model: this.state.initialModel,
            violations: {},
        });
    }

    private getCancelButton() {
        return (
            <Button
                id="cancel"
                text={this.props.cancelButtonText}
                type="button"
                onClick={this.props.onCancel}
                className="btn btn-secondary"
            />
        );
    }

    private resolveGroups(groups: Array<Group>) {
        return groups.map((group: Group) => {
            return (
                <FormGroup
                    id={group.id}
                    key={group.id}
                    label={group.label}
                    onClick={this.onGroupClick}
                    isExpanded={this.isCurrentlyExpandedGroupId(group.id)}
                    validityState={this.getValidityState(group)}
                >
                    {this.resolveGroup(group)}
                </FormGroup>
            );
        });
    }

    private getValidityState(group: Group) {
        const fields = getDeclaredFields([group]);
        const containsChanges = this.containsChanges(fields);
        return getGroupValidityState(this.state.violations, fields, containsChanges);
    }

    private containsChanges(fields: Array<Field<any, MODEL>>) {
        return Boolean(fields.find((field) => this.getValue(field.id) !== this.getInitialValue(field.id)));
    }

    private onGroupClick(expandedGroupId: string) {
        if (this.isCurrentlyExpandedGroupId(expandedGroupId)) {
            this.setState((prevState) => ({
                expandedGroupsIds: prevState.expandedGroupsIds.filter((groupId) => groupId !== expandedGroupId),
            }));
        } else {
            this.setState((prevState) => ({
                expandedGroupsIds: [...prevState.expandedGroupsIds, expandedGroupId],
            }));
        }
    }

    private isCurrentlyExpandedGroupId(expandedGroupId: string) {
        return this.state.expandedGroupsIds.includes(expandedGroupId);
    }

    private resolveGroup(group: Group) {
        return group.sections.filter(isSectionTypeSupported).map((section: Section) => this.resolveSection(section));
    }

    private resolveSection(section: Section) {
        const sectionElements = this.getElements(section);
        return (
            <div id={section.id} key={section.id}>
                {sectionElements}
            </div>
        );
    }

    private getElements(section: Section) {
        const sectionFactory = getSectionFactory(section.type);
        if (!sectionFactory) {
            return null;
        }
        const sectionContext: SectionContext = {
            section,
            getValue: this.getValue,
            getBlurHandler: this.getBlurHandler,
            getValueSetter: this.getValueSetter,
            getFieldViolations: this.getFieldViolations,
            getExpandedGroupIds: this.getExpandedGroupIds,
        };
        return sectionFactory(sectionContext);
    }

    private getValueSetter(fieldId: string) {
        return this.valueSetters[fieldId];
    }

    private getValue(fieldId: string) {
        ensureProperty(this.state.model, fieldId);
        const contextElement = get(this.state.model, fieldId);
        return contextElement;
    }

    private getInitialValue(fieldId: string) {
        const contextElement = get(this.state.initialModel, fieldId);
        return contextElement;
    }

    private getBlurHandler(fieldId: string): (event: React.FormEvent<any>) => void {
        return this.blurHandlers[fieldId];
    }

    private getFieldViolations(fieldId: string): Array<ConstraintViolation> {
        return (this.state.violations && this.state.violations[fieldId]) || [];
    }
    private getExpandedGroupIds(): Array<string> {
        return this.state.expandedGroupsIds || [];
    }

    private validate(fieldId: string, value: any): Promise<Array<ConstraintViolation>> {
        const fieldValidators = this.schema[fieldId];
        const model = this.state.model;
        return validateField(fieldValidators, value, model);
    }

    private computeDirtyState(): void {
        const isDirty = !isEqual(this.state.model, this.state.initialModel);
        this.setState({ isDirty });
    }

    private computeValidState() {
        const isValid = this.isValid();
        return this.setStateAsync({ isValid });
    }

    private onUpdate() {
        if (isFunction(this.props.onUpdate)) {
            this.props.onUpdate(this.parseModel());
        }
    }

    private isValid() {
        return getDeclaredFields(this.props.children)
            .map((field: Field<any, MODEL>) => field.id)
            .map(this.getFieldViolations)
            .filter((violations: Array<ConstraintViolation>) =>
                violations.some((violation) => violation.severity === ViolationSeverity.ERROR)
            )
            .every((violations: Array<ConstraintViolation>) => !violations.length);
    }

    private onSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        this.setSubmitting(true);

        this.validateForm()
            .then(this.computeValidState)
            .then(({ isValid }) => {
                if (!isValid) {
                    this.setSubmitting(false);
                    return;
                }
                return this.submitForm();
            });
    }

    private submitForm() {
        const parsedModel = this.parseModel();
        const modelWithMeta = modelWithViolations(parsedModel, this.state.violations);
        this.props
            .onSubmit(modelWithMeta)
            .then((result) => {
                this.setSubmitting(false);
                this.commitCurrentModel();
                return result;
            })
            .catch((result) => {
                const violations = result.violations;
                if (violations) {
                    this.setState({ violations });
                }
                this.setSubmitting(false);
                this.computeDirtyState();
            });
    }

    private validateForm() {
        return Promise.all(
            getDeclaredFields(this.props.children)
                .map((field) => field.id)
                .map((fieldId) => {
                    const fieldValue = this.getValue(fieldId);
                    return this.setViolations(fieldId, fieldValue);
                })
        );
    }

    private parseModel() {
        const fields = getDeclaredFields(this.props.children);
        const getVal = (field: any) => {
            const fieldTypeDefinition = getFieldTypeDefinition(field.type);
            return fieldTypeDefinition.parse(this.getValue(field.id));
        };
        return fields.reduce((fieldMap: any, field: Field<any, MODEL>) => {
            set(fieldMap, field.id, getVal(field));
            return fieldMap;
        }, {});
    }

    private commitCurrentModel() {
        this.setState((prevState) => ({ initialModel: prevState.model }));
    }

    private setSubmitting(submitting: boolean): void {
        this.setState({ isSubmitting: submitting });
    }

    private createBlurHandlers() {
        const fields = getDeclaredFields(this.props.children);
        this.blurHandlers = this.createFieldMap(fields, (field) => this.createBlurHandler(field.id));
    }

    private createBlurHandler(fieldId: string): any {
        if (this.validationOptions.onBlur) {
            return () => this.setViolations(fieldId, this.getValue(fieldId));
        }
        return nop;
    }

    private createChangeHandlers() {
        const fields = getDeclaredFields(this.props.children);
        this.valueSetters = this.createFieldMap(fields, (field) => this.createValueSetter(field.id));
    }

    private createValueSetter(fieldId: string) {
        return (value: any) => {
            if (this.validationOptions.onChange) {
                if (this.validationOptions.delayMillis) {
                    this.debouncedSetViolations(fieldId, value);
                } else {
                    this.setViolations(fieldId, value);
                }
            }
            this.setValue(fieldId, value);
        };
    }

    private setValue(fieldId: string, value: any) {
        this.setState((prevState) => {
            const newModel = Object.assign({}, prevState.model);
            newModel[fieldId] = value;
            return { model: newModel };
        });
    }

    private setViolations(fieldId: string, value: any) {
        return this.validate(fieldId, value).then((violations) => {
            return new Promise((resolve) => {
                this.setState((prevState) => {
                    const formViolations = Object.assign({}, prevState.violations);
                    formViolations[fieldId] = violations;
                    return { violations: formViolations };
                }, resolve);
            });
        });
    }

    private setViolationsFromProps() {
        this.setState({
            violations: this.props.violations,
        });
    }

    private createValidationSchema(groups: Array<Group>) {
        const fields = getDeclaredFields(groups);
        const schema = this.createFieldMap(fields, createFieldValidators.bind(null, this.createViolationFactory()));
        this.schema = schema;
    }

    private createViolationFactory() {
        const violationMessageResolver = this.props.resolveViolationMessage || defaultViolationMessageResolver;
        return (severity: ViolationSeverity, keyOrMessage: string, context: object | null) => {
            const message = violationMessageResolver(keyOrMessage, context);
            return { message, severity };
        };
    }

    private createFieldMap(fields: Array<Field<any, MODEL>>, factory: (field: Field<any, MODEL>) => any) {
        return fields.reduce((fieldMap: any, field: Field<any, MODEL>) => {
            fieldMap[field.id] = factory(field);
            return fieldMap;
        }, {});
    }

    private setStateAsync(state: any): Promise<any> {
        return new Promise((resolve) => {
            this.setState(state, () => {
                resolve(state);
            });
        });
    }
}

export { Form, SectionType, FieldType, FieldContext, ViolationMessageResolver, FormButtonProps };
