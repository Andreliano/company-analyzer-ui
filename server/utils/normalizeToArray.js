export const normalizeToArray = (results) => {
    if (Array.isArray(results)) return results;
    if (Array.isArray(results?.data)) return results.data;
    return [];
};