import { Option } from '../api/index';

interface MarksToOptions<T> {
    [key: number]: Option<T>;
}

class MarksWithOptions<T> {
    private readonly options: Array<Option<T>>;
    private readonly marksToOptions: MarksToOptions<T>;

    constructor(options: Array<Option<T>>) {
        this.options = options.slice();
        this.marksToOptions = this.createMarksToOptionsMap(this.options);
    }

    public getOption(markIndex: number) {
        return this.marksToOptions[markIndex];
    }

    public getMarkIndex(value: T) {
        const entry = Object.entries(this.marksToOptions).find((pair) => pair[1].value === value);
        if (!entry) {
            return 0;
        }
        const key = entry[0];
        return parseInt(key, 10);
    }

    public getMarks() {
        return this.marksToOptions;
    }

    public getMaxStepIndex() {
        return this.options.length - 1;
    }

    private createMarksToOptionsMap(options: Array<Option<T>>) {
        return options.reduce((resultMap: any, option: Option<T>, index: number) => {
            resultMap[index] = option;
            return resultMap;
        }, {});
    }
}

export { MarksWithOptions };
