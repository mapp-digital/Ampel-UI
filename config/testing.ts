import { Matcher, queryHelpers } from 'dom-testing-library';
import { render, RenderResult } from 'react-testing-library';

interface CustomRenderResult extends RenderResult {
    getByDataQa: (id: Matcher) => HTMLElement;
    queryByDataQa: (id: Matcher) => HTMLElement | null;
    queryAllByDataQa: (id: Matcher) => Array<HTMLElement>;
    wait: (millis?: number) => Promise<any>;
}

const CUSTOM_TESTING_ATTRIBUTE = 'data-qa';

function customRender(...ui: Array<any>): CustomRenderResult {
    const utils = render(ui.shift(), ...ui);

    const queryByDataQa = (id: Matcher) => {
        return queryHelpers.queryByAttribute(CUSTOM_TESTING_ATTRIBUTE, utils.baseElement, id);
    };

    const queryAllByDataQa = (id: Matcher) => {
        return queryHelpers.queryAllByAttribute(CUSTOM_TESTING_ATTRIBUTE, utils.baseElement, id);
    };

    const wait = (millis: number = 200) => {
        return new Promise((resolve) => {
            window.setTimeout(resolve, millis);
        });
    };

    return {
        getByDataQa: (id: Matcher) => {
            const element = queryByDataQa(id);
            if (!element) {
                utils.debug(utils.baseElement);
                throw Error(`Unable to find an element by: [${CUSTOM_TESTING_ATTRIBUTE}="${id}"]`);
            }
            return element;
        },
        queryAllByDataQa,
        queryByDataQa,
        wait,
        ...utils,
    };
}

export * from 'react-testing-library';
export { customRender as render };
