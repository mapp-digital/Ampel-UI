interface Option<T> {
    value: T;
    label: string;
}
declare enum ViolationSeverity {
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO"
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
declare const hasViolations: <T>(modelWithMeta: ModelWithMeta<T>) => number;
declare const modelWithViolations: <T>(data: T, violations?: ConstraintViolations | undefined) => {
    data: T;
    violations: ConstraintViolations;
};
export { ConstraintViolation, ConstraintViolations, hasViolations, Option, ModelWithMeta, modelWithViolations, ViolationSeverity, };
export { assignTo, walkTree } from './tree';
