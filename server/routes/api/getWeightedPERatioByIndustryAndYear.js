

export const getWeightedPERatioByIndustryAndYear = async (req, res) => {
    const industry = req.query.industry;
    const year = req.query.year;

    if (!industry && !year) {
        return res.status(400).json({ error: "Missing required query parameters: industry and year" });
    }
    if (!industry) {
        return res.status(400).json({ error: "Missing required query parameter: industry" });
    }
    if (!year) {
        return res.status(400).json({ error: "Missing required query parameter: year" });
    }

    const opts = {
        method: "GET",
        url: `${req.app.settings.COMPANY_ANALYZER_DATA_BASE_URL}/companies/industry/pe-ratio`,
        params: { industry, year }
    };

    try {
        const results = (await res.locals.serviceRequest(opts))?.data;
        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ error: error?.message });
    }
};