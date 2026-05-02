/* Imports */
import {
    normalizeToArray,
} from '../../utils/main.js';

export const getCompaniesByIndustry = async (req, res) => {
    const industry = req.query.industry;

    const opts = {
        method: "GET",
        url: industry
            ? `${req.app.settings.COMPANY_ANALYZER_DATA_BASE_URL}/companies/by-industry`
            : `${req.app.settings.COMPANY_ANALYZER_DATA_BASE_URL}/companies`,
        params: industry ? { industry } : {}
    };

    try {
        const results = (await res.locals.serviceRequest(opts))?.data;

        // Ensure results is always an array
        const companies = normalizeToArray(results);

        return res.status(200).json(companies);
    } catch (error) {
         
        console.error(`[getCompaniesByIndustry] Error for industry ${industry}:`, error?.message);
        return res.status(500).json({ error: error?.message });
    }
};

