export const generateIncomeStatementSheet = async (req, res) => {
    const { ticker, fromYear, toYear } = req.query;

    const opts = {
        method: "POST",
        url: `${req.app.settings.COMPANY_ANALYZER_DATA_BASE_URL}/companies/${ticker}/income-statement/sheet`,
        params: { fromYear, toYear },
    };

    try {
        const sheetId = (await res.locals.serviceRequest(opts))?.data;
        return res.status(200).json({ sheetId });
    } catch (error) {
        return res.status(500).json({ error: error?.message });
    }
};