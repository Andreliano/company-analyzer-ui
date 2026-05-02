
export const getMarketPERatio = async (req, res) => {
    const year = req.query.year;

    if (!year) {
        return res.status(400).json({ error: "Missing required query parameter: year" });
    }

    const opts = {
        method: "GET",
        url: `${req.app.settings.COMPANY_ANALYZER_DATA_BASE_URL}/companies/market/pe-ratio`,
        params: { year }
    };

    try {
        const results = (await res.locals.serviceRequest(opts))?.data;
        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ error: error?.message });
    }
};