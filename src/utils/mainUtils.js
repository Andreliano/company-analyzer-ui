/**
 * This file serves as the central export point for utils functions.
 * It allows for simplified imports of related utility functions in our project.
 * It helps to have only 1 import line for the utils functions.
 */
export {
    getBaseUrl,
    getApiUrl,
} from './apiConfig.js';
export {
    fetchLastNYearsWithData,
    findLatestWeightedPERatio,
    isValidPERatio,
} from './marketUtils.js';