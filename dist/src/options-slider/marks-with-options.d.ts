import { Option } from '../api/index';
interface MarksToOptions<T> {
    [key: number]: Option<T>;
}
declare class MarksWithOptions<T> {
    private readonly options;
    private readonly marksToOptions;
    constructor(options: Array<Option<T>>);
    getOption(markIndex: number): Option<T>;
    getMarkIndex(value: T): number;
    getMarks(): MarksToOptions<T>;
    getMaxStepIndex(): number;
    private createMarksToOptionsMap;
}
export { MarksWithOptions };
