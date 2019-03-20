interface Option<T> {
    value: T;
    label: string;
}

enum ViolationSeverity {
    ERROR = 'ERROR',
    WARNING = 'WARNING',
    INFO = 'INFO',
}

interface ConstraintViolation {
    message: string;
    severity: ViolationSeverity;
}

interface ConstraintViolations {
    [key: string]: Array<ConstraintViolation>;
}

interface ModelWithMeta<TYPE> {
    data: TYPE;
    violations: ConstraintViolations;
}

const hasViolations = <T>(modelWithMeta: ModelWithMeta<T>) => Object.keys(modelWithMeta.violations).length;
const modelWithViolations = <T>(data: T, violations?: ConstraintViolations) => ({ data, violations: violations || {} });

export {
    ConstraintViolation,
    ConstraintViolations,
    hasViolations,
    Option,
    ModelWithMeta,
    modelWithViolations,
    ViolationSeverity,
};

export { assignTo, walkTree } from './tree';
