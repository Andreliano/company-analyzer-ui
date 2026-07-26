export const submitBatchJob = async (req, res) => {
    const opts = {
        method: "POST",
        url: `${req.app.settings.COMPANY_ANALYZER_PROCESS_BASE_URL}/batch/income-statements/distributed`,
        data: req.body,
    };

    try {
        const results = (await res.locals.serviceRequest(opts))?.data;
        return res.status(200).json(results);
    } catch (error) {
        const status = error?.response?.status ?? 500;
        const data = error?.response?.data ?? { error: error?.message };
        return res.status(status).json(data);
    }
};