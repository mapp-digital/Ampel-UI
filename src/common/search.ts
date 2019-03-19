const matches = (search: string, potentialMatch: string) => {
    return !search || potentialMatch.toLowerCase().includes(search.toLowerCase());
};

export { matches };
