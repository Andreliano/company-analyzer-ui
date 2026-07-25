export const getShareDataByTicker = async (req, res) => {
    const { ticker } = req.query;

    const opts = {
        method: "GET",
        url: `${req.app.settings.COMPANY_ANALYZER_DATA_BASE_URL}/companies/${ticker}/share-data/full`,
    };

    try {
        const results = (await res.locals.serviceRequest(opts))?.data;
        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ error: error?.message });
    }
};