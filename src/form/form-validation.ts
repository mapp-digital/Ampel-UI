import * as Yup from 'yup';

import { ConstraintViolation, ConstraintViolations, ViolationSeverity } from '../api';
import { ValidityState } from './form-group';
import { Field, FieldType } from './types';

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

const createFieldValidators = <FIELD, MODEL>(field: Field<FIELD, MODEL>) => {
    const constraintValidators: Array<ConstraintValidator<any, MODEL>> = [];
    const constraints = field.constraints;
    if (constraints) {
        [ViolationSeverity.INFO, ViolationSeverity.WARNING, ViolationSeverity.ERROR].forEach((severity) => {
            const constraintForSeverity = constraints[severity];
            if (!constraintForSeverity) {
                return;
            }
            if (field.type === FieldType.NUMBER) {
                constraintValidators.push(createNumberValidator(field.type, severity));
            }
            if (field.type === FieldType.INTEGER) {
                constraintValidators.push(createIntegerValidator(field.type, severity));
            }
            if (constraintForSeverity.required) {
                constraintValidators.push(createRequiredValidator(field.type, severity));
            }
            if (constraintForSeverity.min) {
                constraintValidators.push(createMinValidator(field.type, severity, constraintForSeverity.min));
            }
            if (constraintForSeverity.max) {
                constraintValidators.push(createMaxValidator(field.type, severity, constraintForSeverity.max));
            }
            if (constraintForSeverity.email) {
                constraintValidators.push(createEmailValidator(field.type, severity));
            }
            if (constraintForSeverity.pattern) {
                constraintValidators.push(createPatternValidator(field.type, severity, constraintForSeverity.pattern));
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

const createRequiredValidator = <FIELD, MODEL>(fieldType: FieldType, severity: ViolationSeverity) => {
    const requiredValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const typeString = getYupTypeConstraintKey(fieldType);
        return Yup[typeString]()
            .trim()
            .required()
            .isValid(value)
            .then((isValid: boolean) => {
                // TODO message provider/i18n
                return isValid ? null : getViolation('is required', severity);
            });
    };
    return requiredValidator;
};

const createMinValidator = <FIELD, MODEL>(fieldType: FieldType, severity: ViolationSeverity, minValue: number) => {
    const minValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const typeString = getYupTypeConstraintKey(fieldType);
        return Yup[typeString]()
            .min(minValue)
            .isValid(value)
            .then((isValid: boolean) => {
                // TODO message provider/i18n
                return isValid ? null : getViolation(`should be greater than or equal ${minValue}`, severity);
            });
    };
    return minValidator;
};

const createMaxValidator = <FIELD, MODEL>(fieldType: FieldType, severity: ViolationSeverity, maxValue: number) => {
    const maxValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const typeString = getYupTypeConstraintKey(fieldType);
        return Yup[typeString]()
            .max(maxValue)
            .isValid(value)
            .then((isValid: boolean) => {
                // TODO message provider/i18n
                return isValid ? null : getViolation(`should be smaller than or equal ${maxValue}`, severity);
            });
    };
    return maxValidator;
};

const createEmailValidator = <FIELD, MODEL>(fieldType: FieldType, severity: ViolationSeverity) => {
    const emailValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const typeString = getYupTypeConstraintKey(fieldType);
        return Yup[typeString]()
            .email()
            .isValid(value)
            .then((isValid: boolean) => {
                // TODO message provider/i18n
                return isValid ? null : getViolation(`is not valid email`, severity);
            });
    };
    return emailValidator;
};

const createNumberValidator = <FIELD, MODEL>(fieldType: FieldType, severity: ViolationSeverity) => {
    const numberValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const typeString = getYupTypeConstraintKey(fieldType);
        return Yup[typeString]()
            .actualNumber()
            .isValid(value)
            .then((isValid: boolean) => {
                // TODO message provider/i18n
                return isValid ? null : getViolation(`is not number`, severity);
            });
    };
    return numberValidator;
};

const createIntegerValidator = <FIELD, MODEL>(fieldType: FieldType, severity: ViolationSeverity) => {
    const integerValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const stringValue = String(value);
        const isValid = stringValue.match(/^[0-9]*$/) && (!stringValue.startsWith('0') || stringValue === '0');
        return Promise.resolve(isValid ? null : getViolation(`is not number`, severity));
    };
    return integerValidator;
};

const createPatternValidator = <FIELD, MODEL>(fieldType: FieldType, severity: ViolationSeverity, pattern: RegExp) => {
    const patternValidator: ConstraintValidator<FIELD, MODEL> = (value) => {
        const typeString = getYupTypeConstraintKey(fieldType);
        return Yup[typeString]()
            .matches(pattern, { excludeEmptyString: true })
            .isValid(value)
            .then((isValid: boolean) => {
                // TODO message provider/i18n
                return isValid ? null : getViolation(`contains illegal characters`, severity);
            });
    };
    return patternValidator;
};

const getYupTypeConstraintKey = (fieldType: FieldType) => {
    return FieldType[fieldType].toString().toLowerCase();
};

const getViolation = (message: string, severity: ViolationSeverity) => ({ message, severity });

const removeNullEntries = (collection: Array<ConstraintViolation>) => collection.filter(Boolean);

export { createFieldValidators, ConstraintValidator, getGroupValidityState, validateField };
