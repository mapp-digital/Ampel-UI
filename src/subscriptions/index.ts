const onOuterClick = (node: Node, callback: () => void): (() => void) => {
    const listener = (event: MouseEvent) => {
        if (!node.contains(event.target as Node)) {
            callback();
        }
    };
    document.addEventListener('click', listener, false);
    return () => document.removeEventListener('click', listener, false);
};

export { onOuterClick };
