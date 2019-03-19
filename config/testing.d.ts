import { Matcher } from 'dom-testing-library';
import { RenderResult } from 'react-testing-library';
interface CustomRenderResult extends RenderResult {
    getByDataQa: (id: Matcher) => HTMLElement;
    queryByDataQa: (id: Matcher) => HTMLElement | null;
    queryAllByDataQa: (id: Matcher) => Array<HTMLElement>;
    wait: (millis?: number) => Promise<any>;
}
declare function customRender(...ui: Array<any>): CustomRenderResult;
export * from 'react-testing-library';
export { customRender as render };
