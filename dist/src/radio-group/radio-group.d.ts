import * as React from 'react';
import { Option } from '../select';
interface Props {
    id: string;
    name: string;
    value: any;
    className?: string;
    options: Array<Option<any>>;
    onChange: (value: any) => void;
}
declare const RadioGroup: React.FunctionComponent<Props>;
export { RadioGroup };
