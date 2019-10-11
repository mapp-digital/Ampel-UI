import { flatten, isObject } from 'lodash';

const difference = <T>(a: T, b: T, prevKey: string = ''): Array<string> => {
    return flatten(
        Object.keys(a).map((key) => {
            const newKey = prevKey ? `${prevKey}.${key}` : key;
            if (isObject(a[key])) {
                return difference(a[key], b[key], newKey);
            }
            return a[key] !== b[key] ? newKey : [];
        })
    );
};

export { difference };
