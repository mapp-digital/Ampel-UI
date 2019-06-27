const onOuterClick = (node: Node, callback: () => void): (() => void) => {
    const listener = (event: MouseEvent) => {
        const target: Node = event.target as Node;
        if (node.contains(target) && !node.isEqualNode(target)) {
            return;
        }
        callback();
    };
    document.addEventListener('mousedown', listener, false);
    return () => document.removeEventListener('mousedown', listener, false);
};

export { onOuterClick };
