import { ConstraintViolation, ConstraintViolations } from '../api';
import { ValidityState } from './form-group';
import { Field } from './types';
declare const getGroupValidityState: <FIELD, MODEL>(violations: ConstraintViolations | undefined, fields: Field<FIELD, MODEL>[], containsChanges: boolean) => ValidityState;
declare const createFieldValidators: <FIELD, MODEL>(field: Field<FIELD, MODEL>) => ConstraintValidator<any, MODEL>[];
declare type ConstraintValidator<VALUE, MODEL> = (value: VALUE, model: MODEL) => Promise<ConstraintViolation | null>;
declare const validateField: <FIELD, MODEL, VALUE>(fieldValidators: ConstraintValidator<FIELD, MODEL>[], value: VALUE, model: MODEL) => Promise<ConstraintViolation[]>;
export { createFieldValidators, ConstraintValidator, getGroupValidityState, validateField };
