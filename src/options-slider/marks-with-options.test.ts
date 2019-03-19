import { MarksWithOptions } from './marks-with-options';

describe('MarksWithOptions', () => {
    it('should create marks with integer keys between 0 and 3', () => {
        const options = [
            {
                value: 'first',
                label: 'First',
            },
            {
                value: 'second',
                label: 'Second',
            },
            {
                value: 'third',
                label: 'Third',
            },
            {
                value: 'fourth',
                label: 'Fourth',
            },
        ];
        const marksWithOptions = new MarksWithOptions(options);

        const marks = marksWithOptions.getMarks();
        expect(Object.keys(marks)).toEqual(['0', '1', '2', '3']);
    });

    it('should create marks with corresponding labels attached', () => {
        const firstOption = {
            value: 'first',
            label: 'First',
        };
        const secondOption = {
            value: 'second',
            label: 'Second',
        };
        const options = [firstOption, secondOption];
        const marksWithOptions = new MarksWithOptions(options);

        const marks = marksWithOptions.getMarks();
        expect(marks).toEqual({
            0: firstOption,
            1: secondOption,
        });
    });

    it('should provide an option by mark index', () => {
        const expectedOption = {
            value: 'second',
            label: 'Second',
        };
        const options = [
            {
                value: 'first',
                label: 'First',
            },
            expectedOption,
        ];
        const marksWithOptions = new MarksWithOptions(options);

        const option = marksWithOptions.getOption(1);
        expect(option).toEqual(expectedOption);
    });

    it('should provide mark index option', () => {
        const expectedOption = {
            value: 'second',
            label: 'Second',
        };
        const options = [
            {
                value: 'first',
                label: 'First',
            },
            expectedOption,
        ];
        const marksWithOptions = new MarksWithOptions(options);

        const markIndex = marksWithOptions.getMarkIndex(expectedOption.value);
        expect(markIndex).toEqual(1);
    });

    it('should return 0 for mark index unknown value', () => {
        const options = [
            {
                value: 'first',
                label: 'First',
            },
            {
                value: 'second',
                label: 'Second',
            },
        ];
        const marksWithOptions = new MarksWithOptions(options);

        expect(marksWithOptions.getMarkIndex('someUnknownValue')).toEqual(0);
    });
});
