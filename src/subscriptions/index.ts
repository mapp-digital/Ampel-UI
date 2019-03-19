const onOuterClick = (node: Node, callback: () => void): (() => void) => {
    const listener = (event: MouseEvent) => {
        if (!node.contains(event.target as Node)) {
            callback();
        }
    };
    document.addEventListener('mousedown', listener, false);
    return () => document.removeEventListener('mousedown', listener, false);
};

export { onOuterClick };
