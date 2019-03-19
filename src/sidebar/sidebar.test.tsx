import * as React from 'react';

import { cleanup, render } from '@config/testing';

import { Sidebar } from './';

describe('Sidebar', () => {
    afterEach(cleanup);

    it('should invoke the registered onClick handler of footer item', () => {
        const id = 'id';
        const onClick = jest.fn();
        const footerItems = [
            {
                id,
                label: 'Some Item',
                onClick,
            },
        ];
        const { getByDataQa } = render(<Sidebar treeNodes={[]} footerItems={footerItems} highlightedNodeId={id} />);
        const item = getByDataQa(`sidebar-footer--item-${id}`);

        item.click();

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should invoke the registered onClick handler of tree node', () => {
        const id = 'id';
        const onClick = jest.fn();
        const nodes = [
            {
                id,
                label: 'Some Item',
            },
        ];
        const { getByDataQa } = render(
            <Sidebar treeNodes={nodes} onNodeClick={onClick} footerItems={[]} highlightedNodeId={id} />
        );
        const node = getByDataQa(`node-${id}`);

        node.click();

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
