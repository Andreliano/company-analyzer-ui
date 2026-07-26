/**
 * Builds a list of the last N years with available P/E ratio data,
 * starting from the current year and going backwards.
 *
 * @param {Function} fetchYearFn - Async function that fetches P/E ratio for a given year.
 *                                 Should return a number or null/undefined if no data.
 * @param {number} targetCount   - How many valid years to collect (default: 5).
 * @param {number} maxLookback   - Max years to look back to avoid infinite search (default: 10).
 * @returns {Promise<Array<{ year: number, avgPERatio: number | null }>>}
 */
export const fetchLastNYearsWithData = async (fetchYearFn, targetCount = 5, maxLookback = 10) => {
    const currentYear = new Date().getFullYear();
    const results = [];

    for (
        let year = currentYear;
        results.length < targetCount && currentYear - year < maxLookback;
        year--
    ) {
        try {
            const ratio = await fetchYearFn(year);
            if (typeof ratio === 'number') {
                results.unshift({ year, avgPERatio: ratio });
            }
        } catch {
        }
    }

    return results;
};

export const isValidPERatio = (value) => typeof value === 'number' && value > 0;

/**
 * Finds the most recent valid weighted P/E ratio for a given industry,
 * searching backwards from startYear to minYear.
 *
 * @param {string} industry
 * @param {number} startYear
 * @param {number} minYear
 * @param {Function} fetchFn - async (industry, year) => number | null
 * @returns {Promise<{ value: number | null, year: number | null }>}
 */
export const findLatestWeightedPERatio = async (industry, startYear, minYear, fetchFn) => {
    for (let year = startYear; year >= minYear; year--) {
        try {
            const value = await fetchFn(industry, year);
            if (isValidPERatio(value)) {
                return { value, year };
            }
        } catch {
            // Year unavailable — skip and continue
        }
    }

    return { value: null, year: null };
};