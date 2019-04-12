import * as Yup from 'yup';

import { ConstraintViolation, ConstraintViolations, ViolationSeverity } from '../api';
import { ValidityState } from './form-group';
import { Field, FieldType } from './types';

const FORM_VIOLATION_PREFIX = 'form.violation';

/**
 * Should be dropped as soon there is new release of Yup
 * https://github.com/jquense/yup/issues/177
 */
Yup.addMethod(Yup.number, 'actualNumber', function() {
    return this.transform((_, originalValue) => {
        let parsed = originalValue;

        if (typeof parsed === 'string') {
            parsed = parsed.replace(/\s/g, '');
            if (parsed === '') {
                return NaN;
            }
            parsed = +parsed;
        }

        if (this.isType(parsed)) {
            return parsed;
        }

        return parseFloat(parsed);
    });
});

const getGroupValidityState = <FIELD, MODEL>(
    violations: ConstraintViolations | undefined,
    fields: Array<Field<FIELD, MODEL>>,
    containsChanges: boolean
) => {
    const hasFieldWithError = containsViolation(violations, fields, ViolationSeverity.ERROR);
    if (hasFieldWithError) {
        return ValidityState.ERROR;
    }
    const hasFieldWithWarning = containsViolation(violations, fields, ViolationSeverity.WARNING);
    if (hasFieldWithWarning) {
        return ValidityState.WARNING;
    }

    if (!containsChanges) {
        return ValidityState.UNCHANGED;
    }
    return ValidityState.VALID;
};

type ViolationFactory = (severity: ViolationSeverity, key: string, context: object | null) => ConstraintViolation;

type ViolationFactoryBound = (key: string, context: object | null) => ConstraintViolation;

const createFieldValidators = <FIELD, MODEL>(violationFactory: ViolationFactory, field: Field<FIELD, MODEL>) => {
    const constraintValidators: Array<ConstraintValidator<any, MODEL>> = [];
    const constraints = field.constraints;
    if (constraints) {
        [ViolationSeverity.INFO, ViolationSeverity.WARNING, ViolationSeverity.ERROR].forEach((severity) => {
            const constraintForSeverity = constraints[severity];
            if (!constraintForSeverity) {
                return;
            }
            if (field.type === FieldType.NUMBER) {
                constraintValidators.push(createNumberValidator(violationFactory.bind(null, severity), field.type));
            }
            if (field.type === FieldType.INTEGER) {
                constraintValidators.push(createIntegerValidator(violationFactory.bind(null, severity)));
            }
            if (constraintForSeverity.required) {
                constraintValidators.push(createRequiredValidator(violationFactory.bind(null, severity), field.type));
            }
            if (constraintForSeverity.min) {
                constraintValidators.push(createMinValidator(violationFactory.bind(null, severity), field.type, constraintForSeverity.min));
            }
            if (constraintForSeverity.max) {
                constraintValidators.push(createMaxValidator(violationFactory.bind(null, severity), field.type, constraintForSeverity.max));
            }
            if (constraintForSeverity.email) {
                constraintValidators.push(createEmailValidator(violationFactory.bind(null, severity), field.type));
            }
            if (constraintForSeverity.pattern) {
                constraintValidators.push(createPatternValidator(violationFactory.bind(null, severity), field.type, constraintForSeverity.pattern));
            }
            if (constraintForSeverity.custom) {
                constraintValidators.push.apply(constraintValidators, constraintForSeverity.custom);
            }
        });
    }
    return constraintValidators;
};

type ConstraintValidator<VALUE, MODEL> = (value: VALUE, model: MODEL) => Promise<ConstraintViolation | null>;

const validateField = <FIELD, MODEL, VALUE>(
    fieldValidators: Array<ConstraintValidator<FIELD, MODEL>>,
    value: VALUE,
    model: MODEL
) => {
    const invokeValidator = (validationFunction: ConstraintValidator<any, any>) => validationFunction(value, model);
    const validations: Array<Promise<ConstraintViolation | null>> = fieldValidators.map(invokeValidator);
    return Promise.all(validations).then(removeNullEntries);
};

const containsViolation = <FIELD, MODEL>(
    violations: ConstraintViolations | undefined,
    fields: Array<Field<FIELD, MODEL>>,
    severity: ViolationSeverity
) => {
    return fields.find((field) => hasViolations(violations, field.id, severity));
};

const hasViolations = (violations: ConstraintViolations | undefined, fieldId: string, severity: ViolationSeverity) => {
    return Boolean(
        violations && violations[fieldId] && violations[fieldId].find((violation) => violation.severity === severity)
    );
};

const createRequiredValidator = <FIELD, MODEL>(violationFactory: ViolationFactoryBound, fieldType: FieldType) => {
    const requiredValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const typeString = getYupTypeConstraintKey(fieldType);
        return Yup[typeString]()
            .trim()
            .required()
            .isValid(value)
            .then((isValid: boolean) => {
                return isValid ? null : violationFactory(`${FORM_VIOLATION_PREFIX}.required`, null);
            });
    };
    return requiredValidator;
};

const createMinValidator = <FIELD, MODEL>(violationFactory: ViolationFactoryBound, fieldType: FieldType, minValue: number) => {
    const minValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const typeString = getYupTypeConstraintKey(fieldType);
        return Yup[typeString]()
            .min(minValue)
            .isValid(value)
            .then((isValid: boolean) => {
                return isValid ? null : violationFactory(`${FORM_VIOLATION_PREFIX}.min`, {minValue});
            });
    };
    return minValidator;
};

const createMaxValidator = <FIELD, MODEL>(violationFactory: ViolationFactoryBound, fieldType: FieldType, maxValue: number) => {
    const maxValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const typeString = getYupTypeConstraintKey(fieldType);
        return Yup[typeString]()
            .max(maxValue)
            .isValid(value)
            .then((isValid: boolean) => {
                return isValid ? null : violationFactory(`${FORM_VIOLATION_PREFIX}.max`, {maxValue});
            });
    };
    return maxValidator;
};

const createEmailValidator = <FIELD, MODEL>(violationFactory: ViolationFactoryBound, fieldType: FieldType) => {
    const emailValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const typeString = getYupTypeConstraintKey(fieldType);
        return Yup[typeString]()
            .email()
            .isValid(value)
            .then((isValid: boolean) => {
                return isValid ? null : violationFactory(`${FORM_VIOLATION_PREFIX}.email`, null);
            });
    };
    return emailValidator;
};

const createNumberValidator = <FIELD, MODEL>(violationFactory: ViolationFactoryBound, fieldType: FieldType) => {
    const numberValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const typeString = getYupTypeConstraintKey(fieldType);
        return Yup[typeString]()
            .actualNumber()
            .isValid(value)
            .then((isValid: boolean) => {
                return isValid ? null : violationFactory(`${FORM_VIOLATION_PREFIX}.number`, null);
            });
    };
    return numberValidator;
};

const createIntegerValidator = <FIELD, MODEL>(violationFactory: ViolationFactoryBound) => {
    const integerValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const stringValue = String(value);
        const isValid = stringValue.match(/^[0-9]*$/) && (!stringValue.startsWith('0') || stringValue === '0');
        return Promise.resolve(isValid ? null : violationFactory(`${FORM_VIOLATION_PREFIX}.integer`, null));
    };
    return integerValidator;
};

const createPatternValidator = <FIELD, MODEL>(violationFactory: ViolationFactoryBound, fieldType: FieldType, pattern: RegExp) => {
    const patternValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const typeString = getYupTypeConstraintKey(fieldType);
        return Yup[typeString]()
            .matches(pattern, { excludeEmptyString: true })
            .isValid(value)
            .then((isValid: boolean) => {
                return Promise.resolve(isValid ? null : violationFactory(`${FORM_VIOLATION_PREFIX}.pattern`, null));
            });
    };
    return patternValidator;
};

const getYupTypeConstraintKey = (fieldType: FieldType) => {
    return FieldType[fieldType].toString().toLowerCase();
};

const removeNullEntries = (collection: Array<ConstraintViolation>) => collection.filter(Boolean);

export { createFieldValidators, ConstraintValidator, getGroupValidityState, validateField };
